import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "@/app/context/CartContext";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/app/services/api";

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "DC", name: "District of Columbia" },
];

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [taxRate, setTaxRate] = useState(0);
  const [shippingCost, setShippingCost] = useState<number>(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [billingData, setBillingData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
    cardType: "" as "visa" | "mastercard" | "discover" | "amex" | "",
  });

  const [sameAsShipping, setSameAsShipping] = useState(false);

  if (cart.length === 0 && !orderComplete) {
    navigate("/");
    return null;
  }

  const taxAmount = useMemo(() => Number((totalPrice * taxRate).toFixed(2)), [taxRate, totalPrice]);
  const grandTotal = useMemo(() => totalPrice + shippingCost + taxAmount, [shippingCost, taxAmount, totalPrice]);

  useEffect(() => {
    const zip = formData.zipCode.trim();
    const state = formData.state.trim();
    
    // If no ZIP or state, reset tax
    if (zip.length < 5 && state.length === 0) {
      setTaxRate(0);
      return;
    }
    
    let cancelled = false;
    (async () => {
      try {
        // Use state if available (more accurate), otherwise use ZIP
        const response = state 
          ? await api.tax.rate(undefined, state)
          : await api.tax.rate(zip);
        
        // Handle both number and string responses from backend
        let rateValue: number;
        if (typeof response === 'object' && response !== null) {
          const rate = (response as any).rate;
          rateValue = typeof rate === 'string' ? parseFloat(rate) : Number(rate);
        } else {
          rateValue = Number(response);
        }
        
        if (!cancelled) {
          const finalRate = Number.isFinite(rateValue) && rateValue >= 0 ? rateValue : 0;
          setTaxRate(finalRate);
          const source = state ? `State ${state}` : `ZIP ${zip}`;
          console.log(`Tax rate updated for ${source}: ${(finalRate * 100).toFixed(2)}%`);
        }
      } catch (e) {
        console.error("Tax rate fetch error:", e);
        if (!cancelled) setTaxRate(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [formData.zipCode, formData.state]);

  useEffect(() => {
    // calculate shipping from backend (weight-based)
    let cancelled = false;
    (async () => {
      try {
        const items = cart.map((i) => ({ quantity: i.quantity, weight: i.weight }));
        const r = await api.shipping.calculate(items);
        const cost = Number((r as any).shippingCost ?? 0);
        if (!cancelled) setShippingCost(Number.isFinite(cost) ? cost : 0);
      } catch {
        if (!cancelled) setShippingCost(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [cart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment information
    if (!validateCardNumber()) {
      toast.error(`Card number must be ${paymentData.cardType === "amex" ? "15" : "16"} digits`);
      return;
    }
    
    if (!validateExpirationDate()) {
      toast.error("Please enter a valid expiration date (MM/YY)");
      return;
    }
    
    if (!validateCVV()) {
      toast.error(`CVV must be ${paymentData.cardType === "amex" ? "4" : "3"} digits`);
      return;
    }
    
    // Validate billing address if not same as shipping
    if (!sameAsShipping) {
      if (!billingData.firstName || !billingData.lastName || !billingData.address || 
          !billingData.city || !billingData.state || !billingData.zipCode) {
        toast.error("Please complete all billing address fields");
        return;
      }
    }
    
    setIsProcessing(true);

    try {
      const productQuantities: Record<number, number> = {};
      cart.forEach((item) => {
        productQuantities[item.id] = item.quantity;
      });

      const orderResponse = await api.orders.create({
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        productQuantities,
      });

      // Handle both { orderId } and full Order response
      const orderId = (orderResponse as any).orderId || (orderResponse as any).order?.orderId;
      if (!orderId) {
        throw new Error("Order ID not received from server");
      }

      setOrderId(orderId);
      setOrderComplete(true);
      clearCart();
      toast.success(`Order placed! Order ID: ${orderId}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBillingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBillingData({
      ...billingData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber") {
      // Remove all non-digits
      const digitsOnly = value.replace(/\D/g, "");
      
      // Detect card type based on first digit
      let cardType: "visa" | "mastercard" | "discover" | "amex" | "" = "";
      if (digitsOnly.startsWith("4")) {
        cardType = "visa";
      } else if (digitsOnly.startsWith("5") || digitsOnly.startsWith("2")) {
        cardType = "mastercard";
      } else if (digitsOnly.startsWith("6")) {
        cardType = "discover";
      } else if (digitsOnly.startsWith("3")) {
        cardType = "amex";
      }
      
      // Format based on card type
      let formatted = digitsOnly;
      if (cardType === "amex") {
        // Amex: 4-6-5 format (15 digits)
        if (digitsOnly.length > 4) {
          formatted = digitsOnly.slice(0, 4) + " " + digitsOnly.slice(4);
        }
        if (digitsOnly.length > 10) {
          formatted = digitsOnly.slice(0, 4) + " " + digitsOnly.slice(4, 10) + " " + digitsOnly.slice(10, 15);
        }
        formatted = formatted.slice(0, 17); // Max 15 digits + 2 spaces
      } else {
        // Visa/Mastercard/Discover: 4-4-4-4 format (16 digits)
        formatted = digitsOnly.match(/.{1,4}/g)?.join(" ") || digitsOnly;
        formatted = formatted.slice(0, 19); // Max 16 digits + 3 spaces
      }
      
      setPaymentData({
        ...paymentData,
        cardNumber: formatted,
        cardType,
      });
    } else if (name === "expirationDate") {
      // Format as MM/YY
      const digitsOnly = value.replace(/\D/g, "");
      let formatted = digitsOnly;
      if (digitsOnly.length >= 2) {
        formatted = digitsOnly.slice(0, 2) + "/" + digitsOnly.slice(2, 4);
      }
      formatted = formatted.slice(0, 5); // Max MM/YY
      setPaymentData({
        ...paymentData,
        expirationDate: formatted,
      });
    } else if (name === "cvv") {
      // Only digits, max 4 for Amex, 3 for others
      const digitsOnly = value.replace(/\D/g, "");
      const maxLength = paymentData.cardType === "amex" ? 4 : 3;
      setPaymentData({
        ...paymentData,
        cvv: digitsOnly.slice(0, maxLength),
      });
    }
  };

  const handleSameAsShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSameAsShipping(checked);
    
    if (checked) {
      // Copy shipping address to billing address
      setBillingData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });
    }
  };

  // Update billing address when shipping address changes and checkbox is checked
  useEffect(() => {
    if (sameAsShipping) {
      setBillingData({
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });
    }
  }, [formData, sameAsShipping]);

  const validateCardNumber = (): boolean => {
    const digitsOnly = paymentData.cardNumber.replace(/\D/g, "");
    if (paymentData.cardType === "amex") {
      return digitsOnly.length === 15;
    } else {
      return digitsOnly.length === 16;
    }
  };

  const validateExpirationDate = (): boolean => {
    const [month, year] = paymentData.expirationDate.split("/");
    if (!month || !year || month.length !== 2 || year.length !== 2) {
      return false;
    }
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt("20" + year, 10);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (monthNum < 1 || monthNum > 12) return false;
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    return true;
  };

  const validateCVV = (): boolean => {
    const cvvLength = paymentData.cardType === "amex" ? 4 : 3;
    return paymentData.cvv.length === cvvLength;
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-8">
            Thank you for your purchase. You will receive an email confirmation
            shortly.
          </p>
          {orderId && (
            <p className="text-sm text-gray-700 mb-8">
              <span className="font-semibold">Order ID:</span> {orderId}
            </p>
          )}
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Shipping Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name <span aria-label="required">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-label="First name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name <span aria-label="required">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-label="Last name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span aria-label="required">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                aria-label="Email address"
                autoComplete="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Zip Code
                </label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  placeholder="12345"
                  maxLength={5}
                  pattern="[0-9]{5}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {formData.zipCode.length >= 5 && taxRate > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    Tax rate: {(taxRate * 100).toFixed(2)}%
                  </p>
                )}
              </div>
            </div>

            {/* Billing Address Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Billing Address
              </h2>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={handleSameAsShippingChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm font-semibold text-gray-700">
                    Same as shipping address
                  </span>
                </label>
              </div>

              {!sameAsShipping && (
                <div>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingData.firstName}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingData.lastName}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={billingData.address}
                      onChange={handleBillingChange}
                      required={!sameAsShipping}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingData.city}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                      </label>
                      <select
                        name="state"
                        value={billingData.state}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="">Select State</option>
                        {US_STATES.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingData.zipCode}
                        onChange={handleBillingChange}
                        required={!sameAsShipping}
                        placeholder="12345"
                        maxLength={5}
                        pattern="[0-9]{5}"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Payment Information
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder={paymentData.cardType === "amex" ? "3782 822463 10005" : "4111 1111 1111 1111"}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                {paymentData.cardNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    {paymentData.cardType === "amex" 
                      ? "American Express (15 digits)" 
                      : paymentData.cardType 
                        ? `${paymentData.cardType.charAt(0).toUpperCase() + paymentData.cardType.slice(1)} (16 digits)`
                        : "Visa/Mastercard/Discover (16 digits) or American Express (15 digits)"}
                  </p>
                )}
                {paymentData.cardNumber && !validateCardNumber() && (
                  <p className="text-xs text-red-600 mt-1">
                    Card number must be {paymentData.cardType === "amex" ? "15" : "16"} digits
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiration Date (MM/YY)
                  </label>
                  <input
                    type="text"
                    name="expirationDate"
                    value={paymentData.expirationDate}
                    onChange={handlePaymentChange}
                    placeholder="12/25"
                    maxLength={5}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {paymentData.expirationDate && !validateExpirationDate() && (
                    <p className="text-xs text-red-600 mt-1">
                      Please enter a valid expiration date
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={paymentData.cvv}
                    onChange={handlePaymentChange}
                    placeholder={paymentData.cardType === "amex" ? "1234" : "123"}
                    maxLength={4}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {paymentData.cvv && !validateCVV() && (
                    <p className="text-xs text-red-600 mt-1">
                      CVV must be {paymentData.cardType === "amex" ? "4" : "3"} digits
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition mt-6"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t pt-3">
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mt-2">
                  <span>Tax ({taxRate > 0 ? `${(taxRate * 100).toFixed(2)}%` : "by ZIP"})</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>${grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
