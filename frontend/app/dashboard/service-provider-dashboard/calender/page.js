"use client";

import { 
  useCreateDateMutation, 
  useCreateTimeSlotMutation, 
  useDeleteDateMutation, 
  useDeleteTimeslotMutation, 
  useGetProviderDatesQuery, 
  useGetProviderTimeslotsQuery 
} from "@/feature/provider/ProviderApi";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FiClock, FiTrash2, FiPlus, FiCalendar } from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";

export default function AvailabilityPage() {
  // State variables
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("60m");
  const [calendarDays, setCalendarDays] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isDateLoading, setIsDateLoading] = useState(false);
  const [isTimeSlotLoading, setIsTimeSlotLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: "09:00",
    endTime: "10:00",
    isBooked: false
  });
  
  // Get user session
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // RTK Query hooks
  const [createDate] = useCreateDateMutation();
  const [deleteDate] = useDeleteDateMutation();
  const { data: datesResponse, isLoading: datesLoading, refetch: refetchDates } = useGetProviderDatesQuery(userId);
  
  const [createTimeSlot] = useCreateTimeSlotMutation();
  const [deleteTimeslot] = useDeleteTimeslotMutation();
  const { data: timeslotsResponse, isLoading: timeslotsLoading, refetch: refetchTimeslots } = useGetProviderTimeslotsQuery(selectedDateId);

  console.log(selectedDateId, 'yes got it');

  // Current date
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Format date to YYYY-MM-DD
  const formatDateToYMD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format time for display
  const formatTimeForDisplay = (time) => {
    const [hour, minute] = time.split(':');
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Load available dates and time slots
  useEffect(() => {
    if (datesResponse?.data) {
      setAvailableDates(datesResponse.data);
      console.log("Loaded dates:", datesResponse.data);
      
      // Find if selected date exists in available dates
      const selectedDateString = formatDateToYMD(selectedDate);
      const foundDate = datesResponse.data.find(
        date => formatDateToYMD(date.workingDate) === selectedDateString
      );
      
      if (foundDate) {
        setSelectedDateId(foundDate._id);
      } else {
        setSelectedDateId(null);
      }
    }
  }, [datesResponse, selectedDate]);

  // Load time slots for selected date
  useEffect(() => {
    if (timeslotsResponse?.data && selectedDateId) {
      setTimeSlots(timeslotsResponse.data);
      console.log("Loaded timeslots:", timeslotsResponse.data);
    } else {
      setTimeSlots([]);
    }
  }, [timeslotsResponse, selectedDateId]);

  // Generate calendar days
  useEffect(() => {
    generateCalendarDays();
  }, [selectedDate, availableDates]);

  // Calendar functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    const days = [];

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ label: "", isCurrentMonth: false, isEmpty: true });
    }

    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateString = formatDateToYMD(date);
      
      const isToday = today.getDate() === i && today.getMonth() === currentMonth;
      const isSelected = selectedDate.getDate() === i && selectedDate.getMonth() === currentMonth;
      
      const isAvailable = availableDates.some(
        date => formatDateToYMD(date.workingDate) === dateString
      );

      const isPastDate = date < new Date(today.setHours(0, 0, 0, 0));

      days.push({
        label: String(i),
        date: date,
        dateString: dateString,
        isCurrentMonth: true,
        isToday,
        isSelected,
        isAvailable,
        isPastDate,
        isEmpty: false,
      });
    }

    setCalendarDays(days);
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    if (day.isCurrentMonth && !day.isPastDate) {
      setSelectedDate(day.date);
      
      // Find if this date exists in available dates
      const foundDate = availableDates.find(
        date => formatDateToYMD(date.workingDate) === day.dateString
      );
      
      if (foundDate) {
        setSelectedDateId(foundDate._id);
      } else {
        setSelectedDateId(null);
      }
    }
  };

  // Handle creating a new date
  const handleCreateDate = async () => {
    if (!userId) {
      toast.error("Please login first");
      return;
    }

    const selectedDateString = formatDateToYMD(selectedDate);
    const alreadyExists = availableDates.some(
      date => formatDateToYMD(date.workingDate) === selectedDateString
    );

    if (alreadyExists) {
      toast.error("This date is already marked as available");
      return;
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (selectedDate < todayStart) {
      toast.error("Cannot mark past dates as available");
      return;
    }

    setIsDateLoading(true);
    try {
      const dateData = {
        provider: userId,
        workingDate: selectedDate,
        duration: selectedDuration,
        isAvailable: true,
      };

      const result = await createDate(dateData).unwrap();
      
      if (result.message === "Success") {
        toast.success("Date marked as available successfully");
        refetchDates();
      } else {
        toast.error("Failed to mark date as available");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to mark date as available");
    } finally {
      setIsDateLoading(false);
    }
  };

  // Handle creating a new time slot
  const handleCreateTimeSlot = async () => {
    if (!selectedDateId) {
      toast.error("Please select an available date first");
      return;
    }

    if (!newTimeSlot.startTime || !newTimeSlot.endTime) {
      toast.error("Please enter start and end time");
      return;
    }

    setIsTimeSlotLoading(true);
    try {
      const timeSlotData = {
        availability: selectedDateId,
        startTime: newTimeSlot.startTime,
        endTime: newTimeSlot.endTime,
        duration: selectedDuration,
        isBooked: false
      };

      const result = await createTimeSlot(timeSlotData).unwrap();
      
      if (result.message === "Success") {
        toast.success("Time slot created successfully");
        setNewTimeSlot({ startTime: "09:00", endTime: "10:00", isBooked: false });
        refetchTimeslots();
      } else {
        toast.error("Failed to create time slot");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create time slot");
    } finally {
      setIsTimeSlotLoading(false);
    }
  };

  // Handle deleting a date
  const handleDeleteDate = async (dateId) => {
    if (!confirm("Are you sure you want to delete this date and all its time slots?")) {
      return;
    }

    setDeletingId(dateId);
    try {
      const result = await deleteDate(dateId).unwrap();
      
      if (result.message === "Success") {
        toast.success("Date deleted successfully");
        refetchDates();
        if (selectedDateId === dateId) {
          setSelectedDateId(null);
          setTimeSlots([]);
        }
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete date");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle deleting a time slot
  const handleDeleteTimeSlot = async (slotId) => {
    if (!confirm("Are you sure you want to delete this time slot?")) {
      return;
    }

    setDeletingId(slotId);
    try {
      const result = await deleteTimeslot(slotId).unwrap();
      
      if (result.message === "Success") {
        toast.success("Time slot deleted successfully");
        refetchTimeslots();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete time slot");
    } finally {
      setDeletingId(null);
    }
  };

  // Format month and year for display
  const formatMonthYear = () => {
    return today.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Format selected date for display
  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  };

  // Get selected date object from available dates
  const getSelectedDateObject = () => {
    return availableDates.find(date => date._id === selectedDateId);
  };

  const durations = ["30m", "60m", "90m", "120m"];

  return (
    <div className='min-h-screen px-2 pt-6 flex justify-center'>
      <Toaster position="top-right" />
      <div className='w-full max-w-6xl space-y-6'>
        
        {/* ================== CALENDAR SECTION ================== */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          
          {/* LEFT: CALENDAR */}
          <div className='bg-white rounded-2xl border border-[#EFE9FF] shadow-sm p-6'>
            <div className="flex items-center justify-between mb-6">
              <h2 className='text-xl font-semibold text-gray-900'>
                <FiCalendar className="inline mr-2" />
                Select Date
              </h2>
              <div className="text-sm font-medium text-gray-800">
                {formatMonthYear()}
              </div>
            </div>

            {/* Week days header */}
            <div className='grid grid-cols-7 text-center text-sm text-gray-500 mb-3'>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <span key={day} className="py-2">{day}</span>
              ))}
            </div>

            {/* Calendar grid */}
            <div className='grid grid-cols-7 gap-2'>
              {calendarDays.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDateSelect(day)}
                  disabled={day.isEmpty || day.isPastDate}
                  className={`
                    h-12 rounded-lg flex flex-col items-center justify-center text-sm transition-all
                    ${day.isEmpty ? 'invisible' : ''}
                    ${day.isPastDate ? 'opacity-40 cursor-not-allowed text-gray-400' : 'cursor-pointer'}
                    ${day.isAvailable ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-gray-50 text-gray-700'}
                    ${day.isSelected ? 'bg-purple-600 text-white border-2 border-purple-500' : ''}
                    ${day.isToday && !day.isSelected ? 'ring-2 ring-purple-300' : ''}
                    ${!day.isSelected && !day.isPastDate ? 'hover:bg-gray-100' : ''}
                  `}
                >
                  <span>{day.label}</span>
                  {day.isAvailable && !day.isSelected && (
                    <div className="w-1.5 h-1.5 mt-1 bg-green-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>

            {/* Date Actions */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {formatSelectedDate()}
                {getSelectedDateObject() && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Available
                  </span>
                )}
              </div>
              <button
                onClick={handleCreateDate}
                disabled={isDateLoading || selectedDateId || selectedDate < new Date(today.setHours(0, 0, 0, 0))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isDateLoading || selectedDateId || selectedDate < new Date(today.setHours(0, 0, 0, 0))
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#8736C5] to-[#F88D25] text-white hover:opacity-90"
                }`}
              >
                {isDateLoading ? "Adding..." : selectedDateId ? "Already Available" : "Mark as Available"}
              </button>
            </div>
          </div>

          {/* RIGHT: TIME SLOTS */}
          <div className='bg-white rounded-2xl border border-[#EFE9FF] shadow-sm p-6'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>
              <FiClock className="inline mr-2" />
              Time Slots for {formatSelectedDate()}
            </h2>

            {!selectedDateId ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">📅</div>
                <p className="text-gray-600 mb-2">No date selected</p>
                <p className="text-sm text-gray-500">
                  First mark a date as available to add time slots
                </p>
              </div>
            ) : (
              <>
                {/* Add Time Slot Form */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Add New Time Slot</h3>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                      <input
                        type="time"
                        value={newTimeSlot.startTime}
                        onChange={(e) => setNewTimeSlot({...newTimeSlot, startTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">End Time</label>
                      <input
                        type="time"
                        value={newTimeSlot.endTime}
                        onChange={(e) => setNewTimeSlot({...newTimeSlot, endTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                  
                    </div>
                    <button
                      onClick={handleCreateTimeSlot}
                      disabled={isTimeSlotLoading}
                      className="px-4 py-2 bg-gradient-to-r from-[#8736C5] to-[#F88D25] text-white text-sm rounded-lg hover:opacity-90 transition"
                    >
                      {isTimeSlotLoading ? 'Adding...' : 'Add Slot'}
                    </button>
                  </div>
                </div>

                {/* Time Slots List */}
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {timeslotsLoading ? (
                    <div className="text-center py-8">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <p className="mt-2 text-sm text-gray-500">Loading time slots...</p>
                    </div>
                  ) : timeSlots.length > 0 ? (
                    timeSlots.map(slot => (
                      <div
                        key={slot._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {formatTimeForDisplay(slot.startTime)}
                            </div>
                            <div className="text-xs text-gray-500">to</div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatTimeForDisplay(slot.endTime)}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Duration: {slot.duration}
                            <div className={`text-xs mt-1 px-2 py-1 rounded-full ${slot.isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                              {slot.isBooked ? 'Booked' : 'Available'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDeleteTimeSlot(slot._id)}
                            disabled={deletingId === slot._id}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Delete time slot"
                          >
                            {deletingId === slot._id ? (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                            ) : (
                              <FiTrash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="text-4xl mb-4">⏰</div>
                      <p className="text-gray-600 mb-2">No time slots yet</p>
                      <p className="text-sm text-gray-500">
                        Add time slots using the form above
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================== ALL AVAILABLE DATES ================== */}
        <div className='bg-white rounded-2xl border border-[#EFE9FF] shadow-sm p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            <FiCalendar className="inline mr-2" />
            All Available Dates
          </h2>

          {datesLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-sm text-gray-500">Loading available dates...</p>
            </div>
          ) : availableDates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableDates.map(date => (
                <div
                  key={date._id}
                  className={`p-4 rounded-lg border transition-all ${
                    date._id === selectedDateId 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900">
                          {formatDateForDisplay(date.workingDate)}
                        </h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Available
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="mb-1">Duration: {date.duration}</div>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(date.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDeleteDate(date._id)}
                        disabled={deletingId === date._id}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete date and all time slots"
                      >
                        {deletingId === date._id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                        ) : (
                          <FiTrash2 size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDate(new Date(date.workingDate));
                          setSelectedDateId(date._id);
                        }}
                        className={`px-3 py-1 text-xs rounded-lg transition ${
                          date._id === selectedDateId
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                  {/* Show time slot count for this date */}
                  {date._id === selectedDateId && timeSlots.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">
                        {timeSlots.length} time slot(s) for this date
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {timeSlots.slice(0, 3).map(slot => (
                          <span 
                            key={slot._id} 
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {formatTimeForDisplay(slot.startTime)}
                          </span>
                        ))}
                        {timeSlots.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{timeSlots.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-gray-600 mb-2">No available dates yet</p>
              <p className="text-sm text-gray-500 mb-4">
                Select dates from the calendar and mark them as available
              </p>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 bg-gradient-to-r from-[#8736C5] to-[#F88D25] text-white rounded-lg hover:opacity-90 transition"
              >
                Start Adding Dates
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}