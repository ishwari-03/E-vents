import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ux/dialog"
import { Input } from "@/components/ux/input"
import { Label } from "@/components/ux/label"
import { Progress } from "@/components/ux/progress"
import { ArrowLeft, ArrowRight, Badge, Heart, MapPin } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ux/select";
import { useMemo, useState } from "react"
import { useConvexMutation } from "@/hooks/use-convex-query"
import { api } from "@/convex/_generated/api"
import { City, State } from "country-state-city"
import { CATEGORIES } from "@/lib/data"
import { toast } from "sonner"

export function OnboardingModal({isOpen,onClose,onComplete}) {
    const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [location, setLocation] = useState({
    state: "",
    city: "",
    country: "India",
  });

  const { mutate: completeOnboarding, isLoading } = useConvexMutation(
    api.users.completeOnboarding
  );

  // Get Indian states
  const indianStates = useMemo(() => {
    return State.getStatesOfCountry("IN");
  }, []);

  // Get cities based on selected state
  const cities = useMemo(() => {
    if (!location.state) return [];
    const selectedState = indianStates.find((s) => s.name === location.state);
    if (!selectedState) return [];
    return City.getCitiesOfState("IN", selectedState.isoCode);
  }, [location.state, indianStates]);

  const toggleInterest = (categoryId) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }
    if (step === 2 && !location.state) {
  toast.error("Please select a state");
  return;
}

    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

 const handleComplete = async () => {
  try {
    await completeOnboarding({
      location: {
        city: location.city || undefined,
        state: location.state,
        country: location.country,
      },
      interests: selectedInterests,
    });

    toast.success("Welcome!! 🎉");
    onComplete(); 
    onClose(); 

    // <-- THIS closes the modal + refreshes
  } catch (error) {
    toast.error("Failed to complete onboarding");
    console.error(error);
  }
};


  const progress = (step / 2) * 100;
 
    return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl top-[10%] !translate-y-0 z-[9999] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="mb-4">
            <Progress value={progress} className="h-1" />
          </div>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            {step === 1 ? (
              <>
                <Heart className="w-6 h-6 text-purple-500" />
                What interests you?
              </>
            ) : (
              <>
                <MapPin className="w-6 h-6 text-purple-500" />
                Where are you located?
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Select at least 3 categories to personalize your experience"
              : "We'll show you events happening near you"}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Select Interests */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleInterest(category.id)}
                    className={`p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      selectedInterests.includes(category.id)
                        ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                        : "border-border hover:border-purple-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    selectedInterests.length >= 3 ? "default" : "secondary"
                  }
                >
                  {selectedInterests.length} selected
                </Badge>
                {selectedInterests.length >= 3 && (
                  <span className="text-sm text-green-500">
                    ✓ Ready to continue
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {/* Step 2: Location */}
{step === 2 && (
  <div className="space-y-6">
    <div className="grid grid-cols-2 gap-4">

      {/* STATE SELECT */}
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select
          value={location.state || undefined}
          onValueChange={(value) =>
            setLocation({ ...location, state: value, city: "" })
          }
        >
          <SelectTrigger id="state" className="h-11 w-full">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>

          <SelectContent className="z-[100000]">
            {indianStates.map((state) => (
              <SelectItem key={state.isoCode} value={state.name}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* CITY SELECT (Optional) */}
      <div className="space-y-2">
        <Label htmlFor="city">City (Optional)</Label>

        <Select
          value={location.city || undefined}
          onValueChange={(value) =>
            setLocation({ ...location, city: value })
          }
          disabled={!location.state}
        >
          <SelectTrigger id="city" className="h-11 w-full">
            <SelectValue placeholder="Select city (optional)" />
          </SelectTrigger>

          <SelectContent className="z-[100000]">
            <SelectItem value="__none">Skip city</SelectItem>

            {cities.map((city) => (
              <SelectItem key={city.name} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>

    {/* LOCATION PREVIEW */}
    {(location.state || location.city) && (
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-purple-500 mt-0.5" />
          <div>
            <p className="font-medium">Your location</p>
            <p className="text-sm text-muted-foreground">
              {location.city && location.city !== "__none"
                ? `${location.city}, `
                : ""}
              {location.state}, {location.country}
            </p>
          </div>
        </div>
      </div>
    )}
  </div>
)}

        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1 gap-2"
          >
            {isLoading
              ? "Completing..."
              : step === 2
                ? "Complete Setup"
                : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
