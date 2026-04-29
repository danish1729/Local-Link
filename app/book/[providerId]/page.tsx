"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { 
  format, 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parse, 
  isBefore, 
  startOfDay,
  addMonths,
  subMonths
} from "date-fns";
import { ChevronLeft, ChevronRight, MapPin, Calendar as CalendarIcon, Clock, Phone, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// Dynamically import map component to avoid SSR issues
const LocationPicker = dynamic(() => import("@/components/map/LocationPicker"), { ssr: false });

type Provider = {
  _id: string;
  name: string;
  serviceType: string;
  hourlyRate: number;
  profileImage: string;
};

type Availability = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

type Booking = {
  bookingDate: string;
  startTime: string;
  endTime: string;
};

export default function BookProviderPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = params.providerId as string;

  const [provider, setProvider] = useState<Provider | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [hours, setHours] = useState<number>(1);

  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We need an endpoint to get basic provider details
        // Assuming /api/providers/[id] gives us what we need
        const provRes = await fetch(`/api/providers/${providerId}`);
        if (provRes.ok) {
          const provData = await provRes.json();
          setProvider(provData.provider || provData);
        }

        const availRes = await fetch(`/api/providers/${providerId}/availability`);
        if (availRes.ok) {
          const availData = await availRes.json();
          setAvailability(availData.availability);
          setUnavailableDates(availData.unavailableDates);
          setExistingBookings(availData.bookings);
        }
      } catch (err) {
        console.error("Error fetching booking data", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (providerId) fetchData();
  }, [providerId]);

  // Calendar logic
  const monthStart = startOfDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
  const monthEnd = startOfDay(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const dateFormat = "d";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onDateClick = (day: Date) => setSelectedDate(day);

  // Time slot generation
  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    const dayOfWeek = selectedDate.getDay();
    const dayConfig = availability.find(a => a.dayOfWeek === dayOfWeek);

    if (!dayConfig || !dayConfig.isAvailable || !dayConfig.startTime || !dayConfig.endTime) {
      return [];
    }

    // Check if it's in unavailableDates
    const isUnavailableDate = unavailableDates.some(ud => isSameDay(new Date(ud), selectedDate));
    if (isUnavailableDate) return [];

    const slots = [];
    let currentSlot = parse(dayConfig.startTime, 'HH:mm', selectedDate);
    const endSlot = parse(dayConfig.endTime, 'HH:mm', selectedDate);

    while (isBefore(currentSlot, endSlot)) {
      const timeString = format(currentSlot, 'HH:mm');
      
      // Calculate endTime for this slot based on requested hours
      const slotEndTime = new Date(currentSlot.getTime() + hours * 60 * 60 * 1000);
      const slotEndTimeString = format(slotEndTime, 'HH:mm');

      // Check if this slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        if (!isSameDay(new Date(booking.bookingDate), selectedDate)) return false;
        
        const bStart = parse(booking.startTime, 'HH:mm', selectedDate);
        const bEnd = parse(booking.endTime, 'HH:mm', selectedDate);

        // Conflict logic: (StartA < EndB) and (EndA > StartB)
        return isBefore(currentSlot, bEnd) && isBefore(bStart, slotEndTime);
      });

      // Also ensure slot doesn't exceed provider's end time
      if (!hasConflict && !isBefore(endSlot, slotEndTime)) {
        slots.push(timeString);
      }

      currentSlot = new Date(currentSlot.getTime() + 60 * 60 * 1000); // 1 hour increment
    }

    return slots;
  }, [selectedDate, availability, unavailableDates, existingBookings, hours]);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !location || !address || !phone || !reason) return;
    
    setIsSubmitting(true);
    try {
      // Get current customer session. (Assuming API knows or we pass a mock ID for now)
      // In a real app we fetch session. For now let's hit a local route that gets session from token
      const sessionRes = await fetch("/api/auth/me"); // Assuming you have an auth endpoint
      const sessionData = await sessionRes.json();
      const customerId = sessionData?.user?._id;

      if (!customerId) {
        alert("Please log in to book.");
        router.push("/login");
        return;
      }

      const totalAmount = (provider?.hourlyRate || 0) * hours;
      const endTimeString = format(
        new Date(parse(selectedTime, 'HH:mm', selectedDate).getTime() + hours * 60 * 60 * 1000), 
        'HH:mm'
      );

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          providerId,
          bookingDate: selectedDate.toISOString(),
          startTime: selectedTime,
          endTime: endTimeString,
          hours,
          totalAmount,
          paymentMethod: "Credit Card", // Default for now
          customerLocation: {
            address,
            coordinates: [location.lng, location.lat]
          },
          phoneNumber: phone,
          reasonForBooking: reason,
          notes
        })
      });

      if (res.ok) {
        setStep(3); // Success step
      } else {
        const err = await res.json();
        alert("Booking failed: " + err.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading booking system...</div>;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8 flex items-center gap-6">
          <div className="h-20 w-20 rounded-full bg-slate-200 overflow-hidden shrink-0">
             {provider?.profileImage ? (
                <img src={provider.profileImage} alt={provider.name} className="h-full w-full object-cover" />
             ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400 font-bold text-2xl">
                  {provider?.name?.charAt(0)}
                </div>
             )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Book {provider?.name || "Provider"}</h1>
            <p className="text-blue-600 font-medium">{provider?.serviceType || "Professional Service"}</p>
            <p className="text-slate-500 mt-1">${provider?.hourlyRate}/hour</p>
          </div>
        </div>

        {/* Steps Progress */}
        {step < 3 && (
          <div className="flex gap-4 mb-8">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-slate-200'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-slate-200'}`} />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8 flex flex-col md:flex-row gap-12"
            >
              {/* Calendar Section */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Select a Date
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="font-medium min-w-[120px] text-center">{format(currentDate, "MMMM yyyy")}</span>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-slate-400 py-2">{d}</div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, i) => {
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, monthStart);
                    const isPast = isBefore(day, startOfDay(new Date()));
                    
                    // Simple availability check for dot indicator
                    const dayConfig = availability.find(a => a.dayOfWeek === day.getDay());
                    const hasAvailability = dayConfig?.isAvailable && !isPast;
                    
                    return (
                      <div key={i} className="aspect-square p-1">
                        <button
                          onClick={() => onDateClick(day)}
                          disabled={!isCurrentMonth || isPast || !hasAvailability}
                          className={`w-full h-full rounded-full flex flex-col items-center justify-center text-sm transition-all
                            ${!isCurrentMonth ? "text-slate-300" : ""}
                            ${isPast || !hasAvailability ? "text-slate-300 cursor-not-allowed opacity-50" : "hover:bg-blue-50"}
                            ${isSelected ? "bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-200" : ""}
                          `}
                        >
                          <span>{format(day, dateFormat)}</span>
                          {hasAvailability && !isSelected && (
                            <span className="w-1 h-1 bg-green-400 rounded-full mt-1 block"></span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8">
                  <label className="block text-sm font-medium text-slate-700 mb-2">How many hours do you need?</label>
                  <select 
                    value={hours} 
                    onChange={(e) => {
                      setHours(Number(e.target.value));
                      setSelectedTime(null); // Reset time if duration changes
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                      <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="w-full md:w-72 flex flex-col border-t md:border-t-0 md:border-l border-slate-100 md:pl-8 pt-8 md:pt-0">
                 <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Available Times
                 </h2>
                 
                 {!selectedDate ? (
                   <div className="flex-1 flex items-center justify-center text-slate-400 text-sm text-center">
                     Please select a date to view available time slots.
                   </div>
                 ) : availableSlots.length === 0 ? (
                   <div className="flex-1 flex items-center justify-center text-slate-400 text-sm text-center">
                     No availability for this duration on {format(selectedDate, 'MMM d')}.
                   </div>
                 ) : (
                   <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                     {availableSlots.map((time, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 px-2 rounded-xl text-sm font-medium transition-all border
                            ${selectedTime === time 
                              ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                              : 'border-slate-200 hover:border-blue-300 text-slate-600 hover:bg-slate-50'}
                          `}
                        >
                          {time}
                        </button>
                     ))}
                   </div>
                 )}

                 <div className="mt-8 pt-6 border-t border-slate-100">
                    <button
                      disabled={!selectedDate || !selectedTime}
                      onClick={() => setStep(2)}
                      className="w-full py-4 rounded-xl bg-slate-900 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                    >
                      Continue
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <button 
                onClick={() => setStep(1)}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Back to Schedule
              </button>

              <h2 className="text-2xl font-bold text-slate-900 mb-8">Booking Details</h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600" /> Exact Location
                    </label>
                    <LocationPicker onChange={(lat, lng) => setLocation({lat, lng})} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
                    <input 
                      type="text" 
                      placeholder="Apt, Suite, Building, Street" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" /> Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600" /> Reason for Booking
                    </label>
                    <input 
                      type="text" 
                      placeholder="E.g., Plumbing leak, Electrical fault" 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" /> Additional Notes
                    </label>
                    <textarea 
                      rows={5}
                      placeholder="Describe the issue in detail, any precautions needed, parking instructions, etc." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                    ></textarea>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Date</span>
                      <span className="font-medium text-slate-900">{selectedDate && format(selectedDate, 'MMMM d, yyyy')}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600">Time</span>
                      <span className="font-medium text-slate-900">{selectedTime} ({hours} {hours > 1 ? 'hours' : 'hour'})</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-slate-600">Rate</span>
                      <span className="font-medium text-slate-900">${provider?.hourlyRate}/hr</span>
                    </div>
                    <div className="pt-4 border-t border-blue-200 flex justify-between">
                      <span className="font-bold text-slate-900">Total</span>
                      <span className="font-bold text-blue-600 text-xl">${(provider?.hourlyRate || 0) * hours}</span>
                    </div>
                  </div>

                  <button
                    disabled={!location || !address || !phone || !reason || isSubmitting}
                    onClick={handleBooking}
                    className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Processing..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Booking Confirmed!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Your appointment with {provider?.name} on <span className="font-bold">{selectedDate && format(selectedDate, 'MMM d, yyyy')}</span> at <span className="font-bold">{selectedTime}</span> has been successfully booked.
              </p>
              <button 
                onClick={() => router.push("/bookings")}
                className="py-3 px-8 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                View My Bookings
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
