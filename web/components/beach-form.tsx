"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBeach, type Beach } from "@/lib/forecast-client";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface BeachFormProps {
  onBeachCreated: () => void;
}

export function BeachForm({ onBeachCreated }: BeachFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [position, setPosition] = useState<Beach["position"]>("S");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !lat || !lng || !position) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      await createBeach({
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        position,
      });
      toast.success(`Beach "${name}" added!`);
      setOpen(false);
      setName("");
      setLat("");
      setLng("");
      setPosition("S");
      onBeachCreated();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add beach";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Beach
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a new beach</DialogTitle>
          <DialogDescription>
            Enter the beach coordinates and orientation to start receiving
            forecasts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="beach-name">Beach name</Label>
            <Input
              id="beach-name"
              placeholder="Copacabana"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="lat">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                placeholder="-22.97"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor="lng">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                placeholder="-43.18"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="position">Coast orientation</Label>
            <Select
              value={position}
              onValueChange={(v) => setPosition(v as Beach["position"])}
            >
              <SelectTrigger id="position">
                <SelectValue placeholder="Select orientation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N">North</SelectItem>
                <SelectItem value="S">South</SelectItem>
                <SelectItem value="E">East</SelectItem>
                <SelectItem value="W">West</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Beach"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
