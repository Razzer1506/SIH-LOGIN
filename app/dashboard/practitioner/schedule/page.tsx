"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { PractitionerLayout } from "@/components/layouts/practitioner-layout"
import { ScheduleCalendar } from "@/components/scheduling/schedule-calendar"
import { AppointmentForm } from "@/components/scheduling/appointment-form"
import { TimeSlotManager } from "@/components/scheduling/time-slot-manager"
import { Clock, Plus, CalendarIcon, Users, Filter, Search } from "lucide-react"

// Mock data for appointments
const mockAppointments = [
  {
    id: "1",
    patient: "Sarah Johnson",
    treatment: "Abhyanga",
    date: "2024-01-15",
    time: "9:00 AM",
    duration: 60,
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "First session, discuss treatment plan",
  },
  {
    id: "2",
    patient: "Michael Chen",
    treatment: "Shirodhara",
    date: "2024-01-15",
    time: "10:30 AM",
    duration: 45,
    status: "confirmed",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Follow-up session",
  },
  {
    id: "3",
    patient: "Emily Davis",
    treatment: "Consultation",
    date: "2024-01-16",
    time: "2:00 PM",
    duration: 30,
    status: "pending",
    avatar: "/placeholder.svg?height=40&width=40",
    notes: "Initial consultation",
  },
]

export default function SchedulePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredAppointments = mockAppointments.filter(
    (appointment) =>
      appointment.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.treatment.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <PractitionerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading font-bold text-3xl text-foreground">Schedule Management</h1>
            <p className="text-muted-foreground">Manage your appointments and availability</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-transparent">
              <Clock className="w-4 h-4 mr-2" />
              Set Availability
            </Button>
            <Button onClick={() => setShowAppointmentForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">32</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">6.5h</p>
                  <p className="text-sm text-muted-foreground">Available Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Badge className="w-6 h-6 bg-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Pending Confirmations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs
          value={viewMode}
          onValueChange={(value) => setViewMode(value as "calendar" | "list")}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-green-200 focus:border-primary"
                />
              </div>
              <Button variant="outline" className="bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <TabsContent value="calendar" className="space-y-6">
            <ScheduleCalendar appointments={filteredAppointments} onDateSelect={setSelectedDate} />
          </TabsContent>

          <TabsContent value="list" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Appointments List */}
              <div className="lg:col-span-2">
                <Card className="border-green-100">
                  <CardHeader>
                    <CardTitle className="font-heading">Appointments</CardTitle>
                    <CardDescription>Manage your scheduled sessions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredAppointments.map((appointment) => (
                      <Card key={appointment.id} className="border-green-100">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={appointment.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {appointment.patient
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-heading font-semibold text-foreground">{appointment.patient}</h4>
                                <p className="text-sm text-muted-foreground">{appointment.treatment}</p>
                              </div>
                            </div>
                            <Badge
                              className={
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {appointment.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-4 h-4" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {appointment.time} ({appointment.duration} min)
                            </span>
                          </div>

                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground mb-3">{appointment.notes}</p>
                          )}

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Time Slot Manager */}
              <div>
                <TimeSlotManager selectedDate={selectedDate} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Appointment Form Modal */}
        {showAppointmentForm && (
          <AppointmentForm onClose={() => setShowAppointmentForm(false)} onSave={() => setShowAppointmentForm(false)} />
        )}
      </div>
    </PractitionerLayout>
  )
}
