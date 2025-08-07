"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Lock, Shield, CheckCircle, Mail } from 'lucide-react'

interface Flight {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    time: string
    date: string
  }
  arrival: {
    airport: string
    time: string
    date: string
  }
  duration: string
  price: number
  stops: number
  aircraft: string
}

interface PaymentGatewayProps {
  selectedFlights: {
    outbound?: Flight
    return?: Flight
  }
  passengerDetails: Array<{
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
    gender: string
  }>
  totalAmount: number
  onPaymentSuccess: (bookingData: any) => void
  onBack: () => void
}

export function PaymentGateway({ 
  selectedFlights, 
  passengerDetails, 
  totalAmount, 
  onPaymentSuccess, 
  onBack 
}: PaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState('card')
  
  // Auto-fill cardholder name with the primary passenger's name
  const primaryPassenger = passengerDetails[0]
  const defaultCardholderName = primaryPassenger ? 
    `${primaryPassenger.firstName} ${primaryPassenger.lastName}`.trim() : ''
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: defaultCardholderName
  })
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handlePayment = async () => {
    setIsProcessing(true)
    setEmailStatus('sending')
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        const bookingReference = `SB${Date.now().toString().slice(-6)}`
        
        const bookingData = {
          bookingReference,
          flights: selectedFlights,
          passengers: passengerDetails,
          totalAmount,
          paymentMethod,
          status: 'confirmed',
          bookingDate: new Date().toISOString()
        }

        // Send confirmation email
        const emailResponse = await fetch('/api/send-confirmation-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: passengerDetails[0].email,
            bookingData
          })
        })

        const emailResult = await emailResponse.json()
        
        if (emailResult.success) {
          setEmailStatus('sent')
          console.log('✅ Email sent successfully:', emailResult)
        } else {
          setEmailStatus('error')
          console.error('❌ Email failed:', emailResult)
        }

        // Small delay to show email status
        setTimeout(() => {
          onPaymentSuccess(bookingData)
        }, 1500)

      } catch (error) {
        console.error('Payment error:', error)
        setEmailStatus('error')
        alert('Payment failed. Please try again.')
        setIsProcessing(false)
      }
    }, 3000) // 3 second delay to simulate processing
  }

  const getEmailStatusMessage = () => {
    switch (emailStatus) {
      case 'sending':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>Sending confirmation email...</span>
          </div>
        )
      case 'sent':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Confirmation email sent!</span>
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <Mail className="h-4 w-4" />
            <span>Email failed (booking still confirmed)</span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Secure Payment</h2>
        <Button variant="outline" onClick={onBack} disabled={isProcessing}>
          Back
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Security Notice */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Secure Payment</p>
                  <p className="text-sm text-green-700">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Notification */}
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-800">Email Confirmation</p>
                  <p className="text-sm text-blue-700">
                    Booking confirmation will be sent to: <strong>{passengerDetails[0]?.email}</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className="h-16"
                  disabled={isProcessing}
                >
                  <div className="text-center">
                    <CreditCard className="h-6 w-6 mx-auto mb-1" />
                    <div className="text-xs">Credit Card</div>
                  </div>
                </Button>
                <Button
                  variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('paypal')}
                  className="h-16"
                  disabled={isProcessing}
                >
                  <div className="text-center">
                    <div className="font-bold text-blue-600">PayPal</div>
                  </div>
                </Button>
                <Button
                  variant={paymentMethod === 'apple' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('apple')}
                  className="h-16"
                  disabled={isProcessing}
                >
                  <div className="text-center">
                    <div className="font-bold">Apple Pay</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Card Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Cardholder Name</Label>
                  <Input
                    value={cardDetails.cardholderName}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cardholderName: e.target.value }))}
                    placeholder="John Doe"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Card Number</Label>
                  <Input
                    value={cardDetails.cardNumber}
                    onChange={(e) => setCardDetails(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Expiry Date</Label>
                    <Input
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/YY"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      disabled={isProcessing}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={billingAddress.address}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="123 Main Street"
                  disabled={isProcessing}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={billingAddress.city}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="New York"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={billingAddress.state}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="NY"
                    disabled={isProcessing}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>ZIP Code</Label>
                  <Input
                    value={billingAddress.zipCode}
                    onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                    placeholder="10001"
                    disabled={isProcessing}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={billingAddress.country}
                    onValueChange={(value) => setBillingAddress(prev => ({ ...prev, country: value }))}
                    disabled={isProcessing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {selectedFlights.outbound && (
                  <div className="flex justify-between">
                    <span>Outbound Flight</span>
                    <span>${selectedFlights.outbound.price * passengerDetails.length}</span>
                  </div>
                )}
                {selectedFlights.return && (
                  <div className="flex justify-between">
                    <span>Return Flight</span>
                    <span>${selectedFlights.return.price * passengerDetails.length}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Taxes & Fees</span>
                  <span>${Math.round(totalAmount * 0.13)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>${totalAmount}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-semibold">Passengers:</p>
                {passengerDetails.map((passenger, index) => (
                  <p key={index} className="text-muted-foreground">
                    {passenger.firstName}{passenger.lastName ? ` ${passenger.lastName}` : ''}
                  </p>
                ))}
              </div>

              {/* Email Status */}
              {emailStatus !== 'idle' && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getEmailStatusMessage()}
                </div>
              )}

              <Button 
                className="w-full" 
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Pay ${totalAmount}</span>
                  </div>
                )}
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                <p>Your payment is secured with 256-bit SSL encryption</p>
                <p className="mt-1">Confirmation email will be sent to {passengerDetails[0]?.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
