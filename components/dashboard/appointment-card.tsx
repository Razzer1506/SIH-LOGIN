import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, User, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AppointmentCardProps {
  appointment: {
    id: string
    patient: string
    type: string
    time: string
    duration: string
    status: string
    avatar: string
    notes?: string
  }
  detailed?: boolean
}

export function AppointmentCard({ appointment, detailed = false }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusAction = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Start Session"
      case "in-progress":
        return "Continue"
      case "pending":
        return "Confirm"
      default:
        return "View"
    }
  }

  return (
    <Card className="border-green-100">
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
              <p className="text-sm text-muted-foreground">{appointment.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
            {detailed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View Patient</DropdownMenuItem>
                  <DropdownMenuItem>Reschedule</DropdownMenuItem>
                  <DropdownMenuItem>Add Notes</DropdownMenuItem>
                  <DropdownMenuItem>Cancel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {appointment.time} ({appointment.duration})
          </span>
        </div>

        {appointment.notes && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
              <FileText className="w-4 h-4" />
              Notes:
            </p>
            <p className="text-sm text-foreground">{appointment.notes}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant={appointment.status === "in-progress" ? "default" : "outline"}
            size="sm"
            className={appointment.status === "in-progress" ? "bg-primary hover:bg-primary/90" : "bg-transparent"}
          >
            {getStatusAction(appointment.status)}
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <User className="w-4 h-4 mr-2" />
            View Patient
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
