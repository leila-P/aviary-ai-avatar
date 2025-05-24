
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User, MapPin, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fa } from 'date-fns/locale';

interface BookingData {
  origin: string;
  destination: string;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  passengers: number;
  tripType: 'oneWay' | 'roundTrip';
  passengerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

interface BookingFormProps {
  onBookingSubmit: (data: BookingData) => void;
  isVisible: boolean;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingSubmit, isVisible }) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    origin: '',
    destination: '',
    departureDate: undefined,
    returnDate: undefined,
    passengers: 1,
    tripType: 'oneWay',
    passengerInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(1);

  const cities = [
    { value: 'thr', label: 'تهران' },
    { value: 'isf', label: 'اصفهان' },
    { value: 'shz', label: 'شیراز' },
    { value: 'mhd', label: 'مشهد' },
    { value: 'tbz', label: 'تبریز' },
    { value: 'ahz', label: 'اهواز' },
    { value: 'krj', label: 'کرج' },
    { value: 'qom', label: 'قم' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookingSubmit(bookingData);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isVisible) return null;

  return (
    <Card className="glass-effect max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-blue-400">
          رزرو بلیط هواپیما
        </CardTitle>
        <div className="flex justify-center mt-4">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
                currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-600 text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                اطلاعات پرواز
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="origin">مبدأ</Label>
                  <Select value={bookingData.origin} onValueChange={(value) => 
                    setBookingData(prev => ({ ...prev, origin: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب شهر مبدأ" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="destination">مقصد</Label>
                  <Select value={bookingData.destination} onValueChange={(value) => 
                    setBookingData(prev => ({ ...prev, destination: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب شهر مقصد" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.filter(city => city.value !== bookingData.origin).map(city => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>نوع سفر</Label>
                <div className="flex space-x-4 mt-2">
                  <Button
                    type="button"
                    variant={bookingData.tripType === 'oneWay' ? 'default' : 'outline'}
                    onClick={() => setBookingData(prev => ({ ...prev, tripType: 'oneWay' }))}
                  >
                    یک طرفه
                  </Button>
                  <Button
                    type="button"
                    variant={bookingData.tripType === 'roundTrip' ? 'default' : 'outline'}
                    onClick={() => setBookingData(prev => ({ ...prev, tripType: 'roundTrip' }))}
                  >
                    رفت و برگشت
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>تاریخ رفت</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {bookingData.departureDate ? (
                          format(bookingData.departureDate, "PPP", { locale: fa })
                        ) : (
                          <span>انتخاب تاریخ</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={bookingData.departureDate}
                        onSelect={(date) => setBookingData(prev => ({ ...prev, departureDate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {bookingData.tripType === 'roundTrip' && (
                  <div>
                    <Label>تاریخ برگشت</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingData.returnDate ? (
                            format(bookingData.returnDate, "PPP", { locale: fa })
                          ) : (
                            <span>انتخاب تاریخ</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={bookingData.returnDate}
                          onSelect={(date) => setBookingData(prev => ({ ...prev, returnDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="passengers">تعداد مسافر</Label>
                <Select value={bookingData.passengers.toString()} onValueChange={(value) => 
                  setBookingData(prev => ({ ...prev, passengers: parseInt(value) }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} نفر
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-400" />
                اطلاعات مسافر
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    value={bookingData.passengerInfo.firstName}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      passengerInfo: { ...prev.passengerInfo, firstName: e.target.value }
                    }))}
                    placeholder="نام خود را وارد کنید"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">نام خانوادگی</Label>
                  <Input
                    id="lastName"
                    value={bookingData.passengerInfo.lastName}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      passengerInfo: { ...prev.passengerInfo, lastName: e.target.value }
                    }))}
                    placeholder="نام خانوادگی خود را وارد کنید"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">ایمیل</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.passengerInfo.email}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    passengerInfo: { ...prev.passengerInfo, email: e.target.value }
                  }))}
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">شماره تماس</Label>
                <Input
                  id="phone"
                  value={bookingData.passengerInfo.phone}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    passengerInfo: { ...prev.passengerInfo, phone: e.target.value }
                  }))}
                  placeholder="09123456789"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-400" />
                تأیید نهایی
              </h3>
              
              <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span>مسیر:</span>
                  <span>{cities.find(c => c.value === bookingData.origin)?.label} → {cities.find(c => c.value === bookingData.destination)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>تاریخ رفت:</span>
                  <span>{bookingData.departureDate ? format(bookingData.departureDate, "PPP", { locale: fa }) : '-'}</span>
                </div>
                {bookingData.tripType === 'roundTrip' && (
                  <div className="flex justify-between">
                    <span>تاریخ برگشت:</span>
                    <span>{bookingData.returnDate ? format(bookingData.returnDate, "PPP", { locale: fa }) : '-'}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>تعداد مسافر:</span>
                  <span>{bookingData.passengers} نفر</span>
                </div>
                <div className="flex justify-between">
                  <span>مسافر:</span>
                  <span>{bookingData.passengerInfo.firstName} {bookingData.passengerInfo.lastName}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep}>
                مرحله قبل
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep} className="ml-auto">
                مرحله بعد
              </Button>
            ) : (
              <Button type="submit" className="ml-auto bg-green-600 hover:bg-green-700">
                تأیید و رزرو
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
