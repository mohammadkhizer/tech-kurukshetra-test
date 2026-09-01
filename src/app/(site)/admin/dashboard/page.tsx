"use client"

import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Loader2, 
  Plus, 
  Trash2, 
  LayoutDashboard, 
  Info, 
  Home as HomeIcon, 
  Gamepad2, 
  Calendar as CalendarIcon, 
  Users, 
  FileText,
  Save,
  UserPlus,
  Rocket,
  AlertTriangle,
  Eye,
  EyeOff,
  KeySquare,
  ShieldCheck,
  ShieldOff,
  Gauge,
  DatabaseZap,
  Pencil,
  Github,
  Linkedin,
  Clock,
  MapPin,
  Megaphone,
  Mail,
  MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFetch } from '@/hooks/use-fetch';
import { decodeHtmlEntities, isValidEmail, isValidPhone } from '@/lib/sanitizer';

const architectCategories = [
  "Organiser",
  "Finance",
  "Social Media",
  "Tech Team",
  "Decoration",
  "Promotion",
  "Management planing and operational Team"
];

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setIsAuthorized(true);
        } else {
          router.replace('/admin/auth');
        }
      })
      .catch(() => router.replace('/admin/auth'))
      .finally(() => setIsAdminLoading(false));
  }, [router]);

  const [activeTab, setActiveTab] = useState('dashboard');

  const { data: sponsors, isLoading: sponsorsLoading, refetch: refetchSponsors } = useFetch<any[]>(isAuthorized ? '/api/admin/sponsors' : null);
  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = useFetch<any[]>(isAuthorized ? '/api/admin/events' : null);
  const { data: festivalDays, isLoading: festivalDaysLoading } = useFetch<any[]>(isAuthorized ? '/api/admin/timeline' : null);

  const [registrations, setRegistrations] = useState<any[]>([]);
  const [registrationsLoading, setRegistrationsLoading] = useState(false);

  // Fetch registrations from Google Sheets via API route
  const fetchRegistrations = async () => {
    if (!isAuthorized) return;
    setRegistrationsLoading(true);
    try {
      const res = await fetch('/api/sheets');
      const json = await res.json();
      if (json.success && json.data) {
        // Map Google Sheets headers to the frontend's expected camelCase keys
        const mapped = json.data.map((row: any) => {
          let parsedTeam = [];
          try {
            parsedTeam = row['TEAM MEMBERS'] ? JSON.parse(row['TEAM MEMBERS']) : [];
          } catch { }

          return {
            id: row['ORDER ID'],
            orderId: row['ORDER ID'],
            fullName: row['NAME'],
            email: row['EMAIL'],
            phoneNumber: row['MOBILE NO.'] || row['MOBILE NO'],
            university: row['INSTITUTION NAME'],
            college: row['INSTITUTION NAME'],
            course: row['BRACH & SEM'],
            selectedEvent: row['EVENT NAME'],
            eventCategory: row['CATEGORY'],
            teamName: row['TEAM NAME'],
            teamMembers: parsedTeam,
            amount: parseFloat(row['AMMOUNT']) || parseFloat(row['AMOUNT']) || 0,
            paymentStatus: row['STATUS'],
            utrNumber: row['UTR'] || row['UTR NO'] || row['UTR NO.'] || row['UTR NUMBER'] || row['UTR Number'],
            registrationDate: row['DATE & TIME']
          };
        });
        setRegistrations(mapped.reverse());
      }
    } catch (e) {
      console.error('Failed to load registrations from Sheets', e);
    } finally {
      setRegistrationsLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [isAuthorized]);
  
  const { data: adminUsers, isLoading: adminUsersLoading, refetch: refetchAdminUsers } = useFetch<any[]>(isAuthorized ? '/api/admin/users' : null);
  const { data: teamMembers, isLoading: teamMembersLoading, refetch: refetchTeamMembers } = useFetch<any[]>(isAuthorized ? '/api/admin/team' : null);
  const { data: announcements, isLoading: announcementsLoading, refetch: refetchAnnouncements } = useFetch<any[]>(isAuthorized ? '/api/admin/announcements' : null);
  const { data: contactMessages, isLoading: contactMessagesLoading } = { data: [] as any[], isLoading: false };


  const sortedTeamMembers = useMemo(() => 
    teamMembers?.slice().sort((a, b) => (a.order || 0) - (b.order || 0)) || [],
    [teamMembers]
  );

  const [newSponsor, setNewSponsor] = useState({ name: '', logoUrl: '', tier: 'Platinum', websiteUrl: '' });
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [currentRule, setCurrentRule] = useState('');
  const [newEvent, setNewEvent] = useState({
    id: '',
    name: '',
    category: 'TECH',
    type: 'team',
    minTeamSize: 1,
    maxTeamSize: 4,
    description: '',
    eventHead: '',
    rules: [] as string[],
    isFree: false,
    registrationFee: '',
    duration: '24h',
    prizePool: '',
    registrationDeadline: '',
    location: '',
    festivalDayId: '',
    startTime: '',
    coordinatorContactName: '',
    coordinatorContactPhone: '',
    coordinatorContactEmail: '',
    imageUrl: '',
  });

  const [heroContent, setHeroContent] = useState({ mainHeadline: '', subHeadline: '', description: '' });
  const [counterStats, setCounterStats] = useState({ competitions: '10+', prizePool: '$10K+' });
  const [newArchitect, setNewArchitect] = useState({
    fullName: '',
    role: 'Student Organizer',
    category: 'Organiser',
    profileImageUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    displayOrder: 0,
  });
  const [editingArchitect, setEditingArchitect] = useState<any | null>(null);
  const [newDay, setNewDay] = useState({ name: '', date: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
  
  const [editingRegistration, setEditingRegistration] = useState<any | null>(null);


  const { data: heroData, isLoading: heroDataLoading } = useFetch<any>(isAuthorized ? '/api/admin/hero' : null);
  const { data: counterData, isLoading: counterDataLoading } = useFetch<any>(isAuthorized ? '/api/admin/counters' : null);


  useEffect(() => {
    if (heroData) {
        setHeroContent({
            mainHeadline: heroData.mainHeadline || '',
            subHeadline: heroData.subHeadline || '',
            description: heroData.description || '',
        });
    }
  }, [heroData]);
  
  useEffect(() => {
    if (counterData) {
        setCounterStats({
            competitions: counterData.competitions || '',
            prizePool: counterData.prizePool || '',
        });
    }
  }, [counterData]);


  const handleHeroInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setHeroContent(prev => ({ ...prev, [name]: value }));
  };

  const handleCounterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCounterStats(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateHero = async () => {
    try {
      const res = await fetch('/api/admin/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(heroContent),
      });
      if (res.ok) {
        toast({ title: "Protocol Updated", description: "Hero section content has been saved." });
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: "Could not save Hero section." });
      }
    } catch {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save Hero section." });
    }
  };

  const handleUpdateCounters = async () => {
    try {
      const res = await fetch('/api/admin/counters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(counterStats),
      });
      if (res.ok) {
        toast({ title: "Protocol Updated", description: "Homepage counters have been saved." });
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: "Could not save counters." });
      }
    } catch {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save counters." });
    }
  };

  const handleAddSponsor = async () => {
    if (!newSponsor.name || !newSponsor.logoUrl) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Sponsor name and logo URL are required." });
        return;
    }
    await fetch('/api/admin/sponsors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSponsor),
    });
    setNewSponsor({ name: '', logoUrl: '', tier: 'Platinum', websiteUrl: '' });
    refetchSponsors();
    toast({ title: "Partner Recruited", description: `${newSponsor.name} added to the roster.` });
  };

  const handleDeleteSponsor = async (id: string) => {
      await fetch(`/api/admin/sponsors/${id}`, { method: 'DELETE' });
      refetchSponsors();
      toast({ title: "Partner Terminated", description: "Sponsor removed from the roster." });
  };
  
  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEventCategoryChange = (value: string) => {
    setNewEvent(prev => ({ ...prev, category: value }));
  };

  const handleEventTypeChange = (value: string) => {
    setNewEvent(prev => ({
      ...prev,
      type: value,
      minTeamSize: value === 'solo' ? 1 : prev.minTeamSize,
      maxTeamSize: value === 'solo' ? 1 : prev.maxTeamSize,
    }));
  };
  
  const handleEventDayChange = (value: string) => {
    setNewEvent(prev => ({ ...prev, festivalDayId: value }));
  };

  const handleNameBlur = () => {
    if (!newEvent.id && newEvent.name.trim()) {
      const generatedSlug = newEvent.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setNewEvent(prev => ({ ...prev, id: generatedSlug }));
    }
  };
  
  const handleAddRule = () => {
    if (currentRule.trim() !== '') {
      setNewEvent(prev => ({ ...prev, rules: [...prev.rules, currentRule.trim()] }));
      setCurrentRule('');
    }
  };

  const handleDeleteRule = (index: number) => {
    setNewEvent(prev => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }));
  };

  const validateAndBuildPayload = () => {
    if (!newEvent.name.trim()) return { error: "Event Name is required." };

    const slug = (newEvent.id || newEvent.name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) return { error: "Event Slug/ID is required." };

    // Unique slug check
    const isDuplicate = events?.some((e: any) =>
      (e.slug === slug || e.id === slug || e._id === slug) &&
      (!editingEvent || (editingEvent.id !== e.id && editingEvent._id !== e._id && editingEvent.slug !== e.slug && editingEvent.id !== slug && editingEvent._id !== slug))
    );

    if (isDuplicate) {
      return { error: `Duplicate Arena ID/Slug: An arena with slug "${slug}" already exists.` };
    }

    if (!newEvent.category) return { error: "Event Category (TECH or NON-TECH) is required." };
    if (!newEvent.description.trim()) return { error: "Event Description is required." };
    if (!newEvent.location.trim()) return { error: "Location / Venue is required." };
    if (!newEvent.festivalDayId) return { error: "Festival Day is required." };
    if (!newEvent.startTime) return { error: "Start Time is required." };
    if (!newEvent.duration.trim()) return { error: "Duration is required." };
    if (!newEvent.prizePool.trim()) return { error: "Prize Pool is required." };
    if (!newEvent.registrationDeadline) return { error: "Registration Deadline date is required." };

    // Date check: registrationDeadline must be on or before Festival Day date
    const selectedDay = festivalDays?.find((d: any) => d.id === newEvent.festivalDayId);
    if (selectedDay?.date && newEvent.registrationDeadline > selectedDay.date) {
      return { error: `Registration Deadline (${newEvent.registrationDeadline}) must be on or before Festival Day (${selectedDay.date}).` };
    }

    // Coordinator Contact validation
    if (!newEvent.coordinatorContactName.trim()) return { error: "Coordinator Contact Name is required." };
    if (!newEvent.coordinatorContactPhone.trim()) return { error: "Coordinator Contact Phone is required." };
    if (!isValidPhone(newEvent.coordinatorContactPhone)) return { error: "Invalid Coordinator Contact Phone format (7-15 digits)." };
    if (!newEvent.coordinatorContactEmail.trim()) return { error: "Coordinator Contact Email is required." };
    if (!isValidEmail(newEvent.coordinatorContactEmail)) return { error: "Invalid Coordinator Contact Email format." };

    // Team Size validation
    const minSize = newEvent.type === 'solo' ? 1 : Number(newEvent.minTeamSize) || 1;
    const maxSize = newEvent.type === 'solo' ? 1 : Number(newEvent.maxTeamSize) || 1;

    if (minSize < 1 || maxSize < 1) {
      return { error: "Team size numbers must be at least 1." };
    }
    if (maxSize < minSize) {
      return { error: "Max Team Size must be greater than or equal to Min Team Size." };
    }

    const feeValue = newEvent.isFree ? 'Free' : (newEvent.registrationFee.trim() || 'Free');

    const payload = {
      id: slug,
      slug: slug,
      name: newEvent.name.trim(),
      category: newEvent.category,
      type: newEvent.type,
      teamSize: { min: minSize, max: maxSize },
      description: newEvent.description.trim(),
      rules: newEvent.rules,
      venue: newEvent.location.trim(),
      location: newEvent.location.trim(),
      date: selectedDay?.date || newEvent.festivalDayId,
      festivalDayId: newEvent.festivalDayId,
      time: newEvent.startTime,
      startTime: newEvent.startTime,
      duration: newEvent.duration.trim(),
      entryFee: feeValue,
      registrationFee: String(feeValue),
      prizePool: newEvent.prizePool.trim(),
      prize: newEvent.prizePool.trim(),
      coordinatorContact: {
        name: newEvent.coordinatorContactName.trim(),
        phone: newEvent.coordinatorContactPhone.trim(),
        email: newEvent.coordinatorContactEmail.trim(),
      },
      eventHead: newEvent.coordinatorContactName.trim(),
      organiserContact: `${newEvent.coordinatorContactPhone.trim()} | ${newEvent.coordinatorContactEmail.trim()}`,
      bannerImage: newEvent.imageUrl.trim(),
      imageUrl: newEvent.imageUrl.trim(),
      registrationDeadline: newEvent.registrationDeadline,
      isTechnical: newEvent.category === 'TECH',
    };

    return { payload };
  };

  const handleAddEvent = async () => {
    const valResult = validateAndBuildPayload();
    if (valResult.error || !valResult.payload) {
      toast({ variant: "destructive", title: "Validation Error", description: valResult.error || "Invalid payload." });
      return;
    }

    const payload = valResult.payload;

    try {
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast({ variant: "destructive", title: "Save Failed", description: json.message || "Failed to add event." });
        return;
      }
      refetchEvents();
      handleCancelEdit();
      toast({ title: "Arena Initialized", description: `${payload.name} has been added.` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Server Error", description: err.message || "Could not save arena." });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
    refetchEvents();
    toast({ title: "Arena Decommissioned", description: "Event removed from the schedule." });
  };

  const handleEditClick = (event: any) => {
    setEditingEvent(event);
    const contact = typeof event.coordinatorContact === 'object' ? event.coordinatorContact : {};
    const tSize = typeof event.teamSize === 'object' ? event.teamSize : {};
    const isTeam = event.type === 'team' || Number(tSize.max) > 1;

    setNewEvent({
      id: event.slug || event.id || '',
      name: event.name || '',
      category: event.category === 'NON-TECH' ? 'NON-TECH' : 'TECH',
      type: isTeam ? 'team' : 'solo',
      minTeamSize: Number(tSize.min) || 1,
      maxTeamSize: Number(tSize.max) || 1,
      description: event.description || '',
      eventHead: event.eventHead || contact.name || '',
      rules: Array.isArray(event.rules) ? event.rules : [],
      isFree: event.entryFee === 'Free' || event.registrationFee === 'Free',
      registrationFee: event.entryFee && event.entryFee !== 'Free' ? String(event.entryFee) : (event.registrationFee || ''),
      duration: event.duration || '24h',
      prizePool: event.prizePool || event.prize || '',
      registrationDeadline: event.registrationDeadline ? event.registrationDeadline.substring(0, 10) : '',
      location: event.location || event.venue || '',
      festivalDayId: event.festivalDayId || event.date || '',
      startTime: event.startTime || event.time || '',
      coordinatorContactName: contact.name || event.eventHead || '',
      coordinatorContactPhone: contact.phone || '',
      coordinatorContactEmail: contact.email || '',
      imageUrl: event.imageUrl || event.bannerImage || '',
    });
    setCurrentRule('');
    setShowCardPreview(false);
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setNewEvent({
      id: '',
      name: '',
      category: 'TECH',
      type: 'team',
      minTeamSize: 1,
      maxTeamSize: 4,
      description: '',
      eventHead: '',
      rules: [],
      isFree: false,
      registrationFee: '',
      duration: '24h',
      prizePool: '',
      registrationDeadline: '',
      location: '',
      festivalDayId: '',
      startTime: '',
      coordinatorContactName: '',
      coordinatorContactPhone: '',
      coordinatorContactEmail: '',
      imageUrl: '',
    });
    setCurrentRule('');
    setShowCardPreview(false);
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    const valResult = validateAndBuildPayload();
    if (valResult.error || !valResult.payload) {
      toast({ variant: "destructive", title: "Validation Error", description: valResult.error || "Invalid payload." });
      return;
    }

    const payload = valResult.payload;

    try {
      const res = await fetch(`/api/admin/events/${editingEvent.id || editingEvent._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast({ variant: "destructive", title: "Update Failed", description: json.message || "Failed to update event." });
        return;
      }
      refetchEvents();
      toast({ title: "Arena Updated", description: `${payload.name} has been updated.` });
      handleCancelEdit();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Server Error", description: err.message || "Could not update arena." });
    }
  };
  
  const handleSeedDatabase = async () => {
    const res = await fetch('/api/admin/seed', { method: 'POST' });
    const data = await res.json();
    if (res.ok && data.success) {
      const s = data.stats;
      refetchEvents();
      toast({
        title: 'Database Seeded',
        description: `Events: ${s.eventsInserted}, Announcements: ${s.announcementsInserted}, Sponsors: ${s.sponsorsInserted}, Team: ${s.teamMembersInserted}, Timeline: ${s.timelineInserted}`,
      });
    } else {
      toast({ variant: 'destructive', title: 'Seed Failed', description: data.message || 'Could not seed database.' });
    }
  };

  const handleNewArchitectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewArchitect(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (parseInt(value, 10) || 0) : value 
    }));
  };
  
  const handleArchitectCategoryChange = (value: string) => {
    setNewArchitect(prev => ({...prev, category: value}));
  };

  const handleAddArchitect = async () => {
      if (!newArchitect.fullName) {
          toast({ variant: "destructive", title: "Incomplete Data", description: "Full Name is required." });
          return;
      }
      await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newArchitect.fullName,
          role: newArchitect.role,
          group: newArchitect.category,
          photoUrl: newArchitect.profileImageUrl,
          linkedinUrl: newArchitect.linkedinUrl,
          order: newArchitect.displayOrder,
        }),
      });
      setNewArchitect({ fullName: '', role: 'Student Organizer', category: 'Organiser', profileImageUrl: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '', resumeUrl: '', displayOrder: 0 });
      toast({ title: "Architect Onboarded", description: `${newArchitect.fullName} has joined the team.` });
  };

  const handleDeleteArchitect = async (id: string) => {
      await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      toast({ title: "Architect Removed", description: "Team member has been removed." });
  };
  
  const handleArchitectEditClick = (architect: any) => {
    setEditingArchitect(architect);
    setNewArchitect({
        fullName: architect.name || architect.fullName || '',
        role: architect.role || 'Student Organizer',
        category: architect.group || architect.category || 'Organiser',
        profileImageUrl: architect.photoUrl || architect.profileImageUrl || '',
        linkedinUrl: architect.linkedinUrl || '',
        githubUrl: architect.githubUrl || '',
        portfolioUrl: architect.portfolioUrl || '',
        resumeUrl: architect.resumeUrl || '',
        displayOrder: architect.order || architect.displayOrder || 0,
    });
  };

  const handleCancelArchitectEdit = () => {
    setEditingArchitect(null);
    setNewArchitect({ fullName: '', role: 'Student Organizer', category: 'Organiser', profileImageUrl: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '', resumeUrl: '', displayOrder: 0 });
  };

  const handleUpdateArchitect = async () => {
    if (!editingArchitect) return;

    await fetch(`/api/admin/team/${editingArchitect.id || editingArchitect._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newArchitect.fullName,
        role: newArchitect.role,
        group: newArchitect.category,
        photoUrl: newArchitect.profileImageUrl,
        linkedinUrl: newArchitect.linkedinUrl,
        order: newArchitect.displayOrder,
      }),
    });
    toast({ title: "Architect Updated", description: `${newArchitect.fullName}'s profile has been updated.` });
    handleCancelArchitectEdit();
  };

  const handleNewDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDay(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDay = async () => {
    if (!newDay.name || !newDay.date) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Day name and date are required." });
        return;
    }
    await fetch('/api/admin/timeline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newDay.name,
        date: newDay.date,
        description: 'Festival day events',
        status: 'Upcoming',
      }),
    });
    setNewDay({ name: '', date: '' });
    toast({ title: "Timeline Updated", description: `${newDay.name} has been added.` });
  };

  const handleDeleteDay = async (id: string) => {
      await fetch(`/api/admin/timeline/${id}`, { method: 'DELETE' });
      toast({ title: "Day Removed", description: "The festival day has been removed from the timeline." });
  };

  const handleSeedDays = async () => {
    const daysToSeed = [
        { title: 'Day 1 — Tech Arenas & Opening Ceremony', date: '2027-01-20', description: 'Opening ceremony followed by 24h Hackathon, Project Showcase, CTF, and Esports qualifiers.', status: 'Upcoming' },
        { title: 'Day 2 — Final Arenas & Closing Ceremony', date: '2027-01-21', description: 'Code Sprint, Workshop, Cultural Stage, Box Cricket finals, and Grand Award Ceremony.', status: 'Upcoming' },
    ];
    for (const day of daysToSeed) {
      await fetch('/api/admin/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(day),
      });
    }
    toast({ title: "Timeline Seeded", description: "Initial festival days have been deployed." });
  };

  const handleNewAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Title and content are required." });
        return;
    }
    await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: newAnnouncement.title,
        content: newAnnouncement.content,
        timestamp: new Date().toISOString(),
      }),
    });
    setNewAnnouncement({ title: '', content: '' });
    toast({ title: "Announcement Published", description: "The new announcement is now live." });
  };

  const handleDeleteAnnouncement = async (id: string) => {
      await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      toast({ title: "Announcement Retracted", description: "The announcement has been removed." });
  };

  const handleToggleRead = (id: string, currentStatus: boolean) => {
    toast({ title: `Message marked as ${!currentStatus ? 'read' : 'unread'}` });
  };

  const handleDeleteMessage = (id: string) => {
      toast({ title: "Message Deleted" });
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/auth');
  };

  const handleToggleAdmin = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      refetchAdminUsers();
      toast({ title: newStatus === 'approved' ? 'Access Granted' : 'Access Suspended', description: `Admin status updated to ${newStatus}.` });
    }
  };

  const handleDeleteAdminUser = async (userId: string) => {
    const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
    if (res.ok) {
      refetchAdminUsers();
      toast({ title: 'Admin User Deleted', description: 'The admin account has been removed.' });
    }
  };
  
    const handleRegistrationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingRegistration) return;
        const { name, value } = e.target;
        setEditingRegistration((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleRegistrationSwitchChange = (name: string, checked: boolean) => {
        if (!editingRegistration) return;
        setEditingRegistration((prev: any) => ({ ...prev, [name]: checked }));
    };
    
    const handleRegistrationSelectChange = (name: string, value: string) => {
        if (!editingRegistration) return;
        setEditingRegistration((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleDeleteRegistration = async (id: string) => {
      // Instead of Firestore, tell the Sheets API to delete it
      setRegistrationsLoading(true);
      try {
        await fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete_registration', payload: { orderId: id } })
        });
        toast({ title: "Registration Deleted", description: "The participant's record has been removed." });
        await fetchRegistrations();
      } catch (e) {
        toast({ title: "Error", description: "Could not drop participant from sheets." });
      } finally {
        setRegistrationsLoading(false);
      }
    };
    
    const handleUpdateRegistration = async () => {
      if (!editingRegistration) return;
      const { id, ...dataToUpdate } = editingRegistration;
      
      setRegistrationsLoading(true);
      try {
        await fetch('/api/sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'update_registration', 
            payload: { orderId: id, ...dataToUpdate } 
          })
        });
        toast({ title: "Registration Updated", description: "Participant details have been saved to Google Sheets." });
        setEditingRegistration(null);
        await fetchRegistrations();
      } catch (e) {
        toast({ title: "Error", description: "Failed to update participant in sheets." });
      } finally {
        setRegistrationsLoading(false);
      }
    };

  const formatDashboardDate = (dateString: string) => {
      if (!dateString) return "No date set";
      try {
          return new Date(dateString).toLocaleDateString([], {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          });
      } catch (e) {
          return "Invalid date";
      }
  };

  const formatDashboardTime = (dateString: string | undefined) => {
      if (!dateString) return "TBD";
      try {
          const date = new Date(dateString);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      } catch (e) {
          return "Invalid Date";
      }
  };



  if (isAdminLoading) {
    return (
        <div className="min-h-screen pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground mt-4">Verifying Credentials...</p>
        </div>
    )
  }

  if (!isAuthorized) {
    return (
        <div className="min-h-screen pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center">
            <div className="glass-panel p-10 max-w-lg w-full border-amber-500/20 relative overflow-hidden bg-black/40">
                <div className="text-center mb-8">
                    <ShieldOff className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h1 className="font-headline text-2xl tracking-tighter text-white uppercase">PENDING AUTHORIZATION</h1>
                    <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                        Your account has been created, but you do not have administrator privileges yet.
                    </p>
                </div>
                <div className="bg-amber-950/50 border border-amber-500/20 p-6 rounded-none space-y-3 text-sm text-amber-200 text-left">
                    <p className="font-bold uppercase tracking-widest text-amber-400">Next Steps:</p>
                    <p>To gain access to the dashboard, an existing administrator must grant you privileges from the 'Admins' tab.</p>
                    <p className="text-xs text-muted-foreground">If you are the first administrator, configure your credentials in the server environment variables (.env).</p>
                </div>
                <Button onClick={handleLogout} variant="outline" className="w-full mt-8 border-primary/20 hover:bg-primary/10 rounded-none text-xs font-headline tracking-widest uppercase">
                    LOGOUT AND TRY ANOTHER ACCOUNT
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="pt-32 pb-40 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="font-headline text-4xl md:text-5xl mb-2 tracking-tighter text-white uppercase">KURUKSHETRA <span className="text-primary">CONTROL</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Protocol Management Panel</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="border-primary/20 rounded-none text-xs font-headline tracking-widest uppercase">
          TERMINATE SESSION
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-8" onValueChange={(value) => { setActiveTab(value); handleCancelEdit(); handleCancelArchitectEdit(); }}>
        <div className="w-full overflow-x-auto">
          <TabsList className="bg-white/5 rounded-none p-1 border border-white/10">
            <TabsTrigger value="dashboard" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Dashboard</TabsTrigger>
            <TabsTrigger value="home" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Home</TabsTrigger>
            <TabsTrigger value="events" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Events</TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Schedule</TabsTrigger>
            <TabsTrigger value="announcements" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Announcements</TabsTrigger>
            <TabsTrigger value="team" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Team</TabsTrigger>
            <TabsTrigger value="registrations" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Registrations</TabsTrigger>
            <TabsTrigger value="admins" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Admins</TabsTrigger>
            <TabsTrigger value="messages" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Messages</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest">Active Arenas</CardDescription>
                <CardTitle className="font-headline text-3xl text-primary">{events?.length || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-accent/20 rounded-none bg-black/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest">Registrations</CardDescription>
                <CardTitle className="font-headline text-3xl text-accent">{registrations?.length ?? 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-blue-500/20 rounded-none bg-black/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest">Session Status</CardDescription>
                <CardTitle className="font-headline text-3xl text-blue-400">ACTIVE</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-green-500/20 rounded-none bg-black/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest">Integrity</CardDescription>
                <CardTitle className="font-headline text-3xl text-green-400">100%</CardTitle>
              </CardHeader>
            </Card>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSeedDatabase} variant="outline" className="border-[#FF6B00]/30 text-[#FF6B00] hover:bg-[#FF6B00]/10 rounded-none text-xs font-headline tracking-widest uppercase">
              <DatabaseZap className="w-4 h-4 mr-2" /> SEED MONGODB DATABASE
            </Button>
          </div>
          <Card className="glass-panel border-primary/10 rounded-none bg-black/20">
            <CardHeader>
              <CardTitle className="font-headline text-lg tracking-widest uppercase">System Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-[10px] font-code text-muted-foreground/60">[SYS] MongoDB connection: Active</div>
              <div className="text-[10px] font-code text-muted-foreground/60">[SYS] Events in database: {events?.length || 0}</div>
              <div className="text-[10px] font-code text-muted-foreground/60">[SYS] Registered admins: {adminUsers?.length || 0}</div>
              <div className="text-[10px] font-code text-muted-foreground/60">[SYS] Total registrations: {registrations?.length ?? 0}</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="home" className="space-y-12">
          <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
            <CardHeader>
              <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                <HomeIcon className="w-5 h-5 text-primary" /> HERO SECTION MANAGER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Main Headline</Label>
                  <Input 
                    name="mainHeadline"
                    value={heroContent.mainHeadline}
                    onChange={handleHeroInputChange}
                    placeholder="BEYOND THE HORIZON" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Sub Headline (Gradient)</Label>
                  <Input 
                    name="subHeadline"
                    value={heroContent.subHeadline}
                    onChange={handleHeroInputChange}
                    placeholder="Battle of Minds" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest">Description Meta</Label>
                <Textarea 
                  name="description"
                  value={heroContent.description}
                  onChange={handleHeroInputChange}
                  placeholder="The most immersive tech battlefield of the year..." className="bg-white/5 border-white/10 rounded-none min-h-[100px]" />
              </div>
              <Button onClick={handleUpdateHero} className="bg-primary hover:bg-primary/80 rounded-none font-headline tracking-widest text-[10px] py-6 px-8">
                <Save className="w-4 h-4 mr-2" /> UPDATE HERO PROTOCOL
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel border-accent/20 rounded-none bg-black/40">
            <CardHeader>
              <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                <Gauge className="w-5 h-5 text-accent" /> COUNTER SETTINGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Competitions</Label>
                  <Input 
                    name="competitions"
                    value={counterStats.competitions}
                    onChange={handleCounterInputChange}
                    placeholder="10+" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Prize Pool</Label>
                  <Input 
                    name="prizePool"
                    value={counterStats.prizePool}
                    onChange={handleCounterInputChange}
                    placeholder="$10K+" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
              </div>
              <Button onClick={handleUpdateCounters} className="bg-accent text-background hover:bg-accent/80 rounded-none font-headline tracking-widest text-[10px] py-6 px-8">
                <Save className="w-4 h-4 mr-2" /> UPDATE COUNTERS
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-accent/20 rounded-none bg-black/40 h-fit">
              <CardHeader>
                <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                  <Rocket className="w-4 h-4 text-accent" /> PARTNER PROTOCOLS
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">Recruit new partners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Company Identity</Label>
                  <Input 
                    value={newSponsor.name}
                    onChange={(e) => setNewSponsor({...newSponsor, name: e.target.value})}
                    placeholder="e.g. Acme Corp" 
                    className="bg-white/5 border-white/10 rounded-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Logo Vector URL</Label>
                  <Input 
                    value={newSponsor.logoUrl}
                    onChange={(e) => setNewSponsor({...newSponsor, logoUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-white/5 border-white/10 rounded-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Website URL</Label>
                  <Input 
                    value={newSponsor.websiteUrl}
                    onChange={(e) => setNewSponsor({...newSponsor, websiteUrl: e.target.value})}
                    placeholder="https://example.com" 
                    className="bg-white/5 border-white/10 rounded-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Sponsorship Tier</Label>
                  <Select
                    value={newSponsor.tier}
                    onValueChange={(value) => setNewSponsor({ ...newSponsor, tier: value })}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSponsor} className="w-full bg-accent text-background hover:bg-accent/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                  RECRUIT PARTNER
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-headline text-xs tracking-widest text-accent uppercase mb-4">ACTIVE PARTNERS</h3>
              {sponsorsLoading && (
                <div className="flex justify-center py-6">
                  <Loader2 className="w-6 h-6 text-accent animate-spin" />
                </div>
              )}
              {sponsors?.map((sponsor) => (
                <div key={sponsor.id} className="glass-panel p-4 border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 glass-panel flex items-center justify-center p-1 bg-white relative">
                      <Image src={decodeHtmlEntities(sponsor.logoUrl || '') || '/favicon.ico'} alt={sponsor.name} width={48} height={48} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-headline text-[11px] text-white tracking-widest uppercase">{sponsor.name}</h4>
                      <p className="text-[8px] text-accent uppercase tracking-widest font-bold">{sponsor.tier}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleDeleteSponsor(sponsor.id)} variant="ghost" className="text-muted-foreground hover:text-destructive p-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40 h-fit">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                  {editingEvent ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                  {editingEvent ? 'EDIT ARENA' : 'ADD ARENA'}
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCardPreview(!showCardPreview)}
                  className="border-primary/40 text-primary hover:bg-primary/10 rounded-none text-[10px] uppercase font-headline tracking-widest"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  {showCardPreview ? 'Hide Preview' : 'Live Preview'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Live Card Preview Panel */}
                {showCardPreview && (
                  <div className="glass-panel p-4 border-primary/30 bg-primary/5 rounded-none mb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-headline font-bold text-primary tracking-widest uppercase">
                        PREVIEW: PUBLIC ARENA CARD
                      </span>
                      <Badge variant="outline" className="text-[9px] border-primary/40 text-primary uppercase rounded-none">
                        {newEvent.category || 'TECH'}
                      </Badge>
                    </div>

                    <div className="border border-white/10 p-4 bg-black/80 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2 bg-primary/10 border border-primary/30 text-primary">
                          <Gamepad2 className="w-5 h-5" />
                        </div>
                        <span className="px-2 py-0.5 text-[9px] font-headline font-bold tracking-widest uppercase border border-primary/30 text-primary bg-primary/10">
                          {newEvent.category || 'TECH'}
                        </span>
                      </div>

                      <h3 className="text-lg font-black tracking-tight font-headline text-white">
                        {newEvent.name || 'Arena Title Placeholder'}
                      </h3>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {newEvent.description || 'Arena description will appear here...'}
                      </p>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-xs">
                        <div>
                          <div className="text-[8px] text-muted-foreground uppercase tracking-widest">Prize Pool</div>
                          <div className="font-headline font-bold text-primary truncate">{newEvent.prizePool || 'TBA'}</div>
                        </div>
                        <div className="border-l border-white/10 pl-2">
                          <div className="text-[8px] text-muted-foreground uppercase tracking-widest">Team Size</div>
                          <div className="font-headline font-bold text-white truncate">
                            {newEvent.type === 'solo' ? 'Solo' : `${newEvent.minTeamSize}-${newEvent.maxTeamSize} Players`}
                          </div>
                        </div>
                        <div className="border-l border-white/10 pl-2">
                          <div className="text-[8px] text-muted-foreground uppercase tracking-widest">Duration</div>
                          <div className="font-headline font-bold text-white truncate">{newEvent.duration || '24h'}</div>
                        </div>
                      </div>

                      <div className="text-[9px] text-muted-foreground pt-1 flex justify-between border-t border-white/5">
                        <span>Venue: {newEvent.location || 'TBA'}</span>
                        <span className="text-primary">Fee: {newEvent.isFree ? 'Free' : (newEvent.registrationFee || 'Free')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1. Event Name */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Name <span className="text-destructive">*</span></Label>
                  <Input
                    name="name"
                    value={newEvent.name}
                    onChange={handleNewEventChange}
                    onBlur={handleNameBlur}
                    placeholder="e.g. Cyber Strike Arena"
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                  />
                </div>

                {/* 2. Slug / ID */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase tracking-widest">Arena ID / Slug <span className="text-destructive">*</span></Label>
                    <button
                      type="button"
                      onClick={handleNameBlur}
                      className="text-[9px] text-primary hover:underline uppercase tracking-wider"
                    >
                      Auto-Generate
                    </button>
                  </div>
                  <Input
                    name="id"
                    value={newEvent.id}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                    placeholder="cyber-strike-arena"
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs font-mono"
                  />
                  <p className="text-[9px] text-muted-foreground">Unique identifier used in URLs (kebab-case).</p>
                </div>

                {/* 3. Event Category Dropdown (TECH vs NON-TECH) */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Category <span className="text-destructive">*</span></Label>
                  <Select 
                    value={newEvent.category} 
                    onValueChange={handleEventCategoryChange}
                  >
                    <SelectTrigger className="w-full bg-white/5 border border-white/10 p-2 text-xs rounded-none text-white h-auto">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white rounded-none">
                      <SelectItem value="TECH">TECH (Technical Events)</SelectItem>
                      <SelectItem value="NON-TECH">NON-TECH (Sports, Gaming & Non-Technical)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Event Type (Solo vs Team) */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Type <span className="text-destructive">*</span></Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={newEvent.type === 'solo' ? 'default' : 'outline'}
                      onClick={() => handleEventTypeChange('solo')}
                      className={`rounded-none text-xs uppercase font-headline tracking-widest ${newEvent.type === 'solo' ? 'bg-primary text-background' : 'border-white/10 text-white'}`}
                    >
                      Solo Event
                    </Button>
                    <Button
                      type="button"
                      variant={newEvent.type === 'team' ? 'default' : 'outline'}
                      onClick={() => handleEventTypeChange('team')}
                      className={`rounded-none text-xs uppercase font-headline tracking-widest ${newEvent.type === 'team' ? 'bg-primary text-background' : 'border-white/10 text-white'}`}
                    >
                      Team Event
                    </Button>
                  </div>
                </div>

                {/* Conditional Team Size Inputs */}
                {newEvent.type === 'team' && (
                  <div className="grid grid-cols-2 gap-3 p-3 glass-panel border-white/10 bg-white/5 rounded-none">
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-widest">Min Team Size <span className="text-destructive">*</span></Label>
                      <Input
                        type="number"
                        min={1}
                        value={newEvent.minTeamSize}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, minTeamSize: Math.max(1, parseInt(e.target.value) || 1) }))}
                        className="bg-white/5 border-white/10 rounded-none text-white text-xs h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[9px] uppercase tracking-widest">Max Team Size <span className="text-destructive">*</span></Label>
                      <Input
                        type="number"
                        min={newEvent.minTeamSize}
                        value={newEvent.maxTeamSize}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, maxTeamSize: Math.max(1, parseInt(e.target.value) || 1) }))}
                        className="bg-white/5 border-white/10 rounded-none text-white text-xs h-8"
                      />
                    </div>
                  </div>
                )}

                {/* 5. Duration */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Duration <span className="text-destructive">*</span></Label>
                  <Input
                    name="duration"
                    value={newEvent.duration}
                    onChange={handleNewEventChange}
                    placeholder="e.g. 3 hours, 24h, 2 days"
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                  />
                </div>

                {/* 6. Prize Pool */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Prize Pool <span className="text-destructive">*</span></Label>
                  <Input
                    name="prizePool"
                    value={newEvent.prizePool}
                    onChange={handleNewEventChange}
                    placeholder="e.g. ₹15,000 or Trophies & Certificates"
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                  />
                </div>

                {/* 7. Registration Deadline */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Registration Deadline Date <span className="text-destructive">*</span></Label>
                  <Input
                    type="date"
                    name="registrationDeadline"
                    value={newEvent.registrationDeadline}
                    onChange={handleNewEventChange}
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                  />
                  <p className="text-[9px] text-muted-foreground">Must be on or before the Festival Day.</p>
                </div>

                {/* 8. Festival Day */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Festival Day <span className="text-destructive">*</span></Label>
                  <Select
                    name="festivalDayId"
                    value={newEvent.festivalDayId}
                    onValueChange={handleEventDayChange}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto" disabled={festivalDaysLoading}>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 backdrop-blur-md border-white/10 text-white rounded-none">
                      {festivalDays && festivalDays.length > 0 ? (
                        festivalDays.map(day => (
                          <SelectItem key={day.id} value={day.id}>{day.name} ({day.date || 'TBA'})</SelectItem>
                        ))
                      ) : (
                        <div className="text-muted-foreground text-xs p-4 text-center">
                          Go to the 'Schedule' tab to add days.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* 9. Start Time */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Start Time <span className="text-destructive">*</span></Label>
                  <Input
                    name="startTime"
                    value={newEvent.startTime}
                    onChange={handleNewEventChange}
                    type="datetime-local"
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                  />
                </div>

                {/* 10. Location / Venue */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Venue / Location <span className="text-destructive">*</span></Label>
                  <Input
                    name="location"
                    value={newEvent.location}
                    onChange={handleNewEventChange}
                    placeholder="e.g. Lab 402, Main Auditorium, Ground"
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                  />
                </div>

                {/* 11. Event Description */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Description <span className="text-destructive">*</span></Label>
                  <Textarea
                    name="description"
                    value={newEvent.description}
                    onChange={handleNewEventChange}
                    rows={3}
                    placeholder="Provide a comprehensive summary of the event..."
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                  />
                </div>

                {/* 12. Coordinator Contact (3 required sub-fields) */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <Label className="text-[10px] uppercase tracking-widest text-primary font-headline">
                    Coordinator Contact <span className="text-destructive">*</span>
                  </Label>
                  <div className="space-y-2 p-3 glass-panel border-white/10 bg-white/5 rounded-none">
                    <div>
                      <Label className="text-[9px] uppercase tracking-widest">Contact Name <span className="text-destructive">*</span></Label>
                      <Input
                        name="coordinatorContactName"
                        value={newEvent.coordinatorContactName}
                        onChange={handleNewEventChange}
                        placeholder="e.g. Alex Vance"
                        className="bg-white/5 border-white/10 rounded-none text-white text-xs h-8 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[9px] uppercase tracking-widest">Contact Phone <span className="text-destructive">*</span></Label>
                      <Input
                        name="coordinatorContactPhone"
                        value={newEvent.coordinatorContactPhone}
                        onChange={handleNewEventChange}
                        placeholder="+91 9876543210"
                        className="bg-white/5 border-white/10 rounded-none text-white text-xs h-8 mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[9px] uppercase tracking-widest">Contact Email <span className="text-destructive">*</span></Label>
                      <Input
                        name="coordinatorContactEmail"
                        value={newEvent.coordinatorContactEmail}
                        onChange={handleNewEventChange}
                        placeholder="alex@techkurukshetra.in"
                        className="bg-white/5 border-white/10 rounded-none text-white text-xs h-8 mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* 13. Registration Fee (Number or Free Toggle) */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] uppercase tracking-widest">Registration Fee</Label>
                    <label className="flex items-center gap-2 text-xs text-primary cursor-pointer font-headline uppercase text-[10px] tracking-wider">
                      <input
                        type="checkbox"
                        checked={newEvent.isFree}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, isFree: e.target.checked }))}
                        className="accent-primary"
                      />
                      Free Entry
                    </label>
                  </div>
                  {!newEvent.isFree && (
                    <Input
                      name="registrationFee"
                      value={newEvent.registrationFee}
                      onChange={handleNewEventChange}
                      placeholder="e.g. ₹100 or 100 per person"
                      className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                    />
                  )}
                </div>

                {/* 14. Event Rules Add-List */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Rules &amp; Guidelines</Label>
                  <div className="flex gap-2">
                    <Input
                      value={currentRule}
                      onChange={(e) => setCurrentRule(e.target.value)}
                      placeholder="Type a rule and press Enter or Add"
                      className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRule();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddRule} className="bg-primary hover:bg-primary/80 rounded-none px-4 text-background text-xs uppercase font-headline tracking-widest">
                      Add Rule
                    </Button>
                  </div>
                  <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                    {newEvent.rules.length > 0 ? newEvent.rules.map((rule, index) => (
                      <div key={index} className="flex items-center justify-between text-xs glass-panel p-2 border-white/5 bg-white/5 rounded-none">
                        <span className="text-muted-foreground break-all">◈ {rule}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteRule(index)}
                          className="text-muted-foreground hover:text-destructive h-6 w-6 ml-2 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    )) : (
                      <p className="text-[10px] text-muted-foreground text-center py-2">No rules added yet.</p>
                    )}
                  </div>
                </div>

                {/* 15. Event Logo / Banner Image URL */}
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Banner / Logo Image URL</Label>
                  <Input
                    name="imageUrl"
                    value={newEvent.imageUrl}
                    onChange={handleNewEventChange}
                    placeholder="https://images.unsplash.com/..."
                    className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                  />
                </div>

                {/* Submit Buttons */}
                <Button
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                  className="w-full bg-primary text-background hover:bg-primary/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase mt-4"
                >
                  {editingEvent ? 'UPDATE ARENA METADATA' : 'INITIALIZE ARENA METADATA'}
                </Button>

                {editingEvent && (
                  <Button onClick={handleCancelEdit} variant="secondary" className="w-full rounded-none font-headline tracking-widest text-[10px] py-4 uppercase mt-2">
                    CANCEL EDIT
                  </Button>
                )}

                <Button onClick={handleSeedDatabase} variant="outline" className="w-full border-accent/20 text-accent hover:bg-accent/10 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                  <DatabaseZap className="w-4 h-4 mr-2" /> SEED INITIAL EVENTS
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-headline text-xs tracking-widest text-primary uppercase mb-4">ACTIVE ARENAS</h3>
              {eventsLoading && <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>}
              {events?.map((event) => (
                <div key={event.id} className="glass-panel p-4 border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 glass-panel flex items-center justify-center text-primary">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-headline text-[11px] text-white tracking-widest uppercase">{event.name}</h4>
                      <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{event.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button onClick={() => handleEditClick(event)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDeleteEvent(event.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40 h-fit">
                <CardHeader>
                    <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                        <Plus className="w-4 h-4 text-primary" /> ADD FESTIVAL DAY
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest">Day Name</Label>
                        <Input name="name" value={newDay.name} onChange={handleNewDayChange} placeholder="e.g. Day 1" className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest">Date</Label>
                        <Input name="date" value={newDay.date} onChange={handleNewDayChange} type="date" className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                    <Button onClick={handleAddDay} className="w-full bg-primary text-background hover:bg-primary/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                        ADD DAY
                    </Button>
                    <Button onClick={handleSeedDays} variant="outline" className="w-full border-accent/20 text-accent hover:bg-accent/10 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                      <DatabaseZap className="w-4 h-4 mr-2" /> SEED INITIAL DAYS
                    </Button>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <h3 className="font-headline text-xs tracking-widest text-primary uppercase mb-4">CURRENT TIMELINE</h3>
                {festivalDaysLoading && <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>}
                {festivalDays?.map(day => (
                    <div key={day.id}>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                              <h4 className="font-headline text-lg tracking-widest text-accent uppercase">{day.name}</h4>
                              <p className="text-xs text-muted-foreground">{formatDashboardDate(day.date)}</p>
                          </div>
                          <Button onClick={() => handleDeleteDay(day.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                              <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 border-l-2 border-accent/20 pl-4">
                           {events?.filter(e => e.festivalDayId === day.id).map(event => (
                              <div key={event.id} className="glass-panel p-3 border-white/5 bg-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-headline text-white">{event.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="w-3 h-3" /> {formatDashboardTime(event.startTime)} <MapPin className="w-3 h-3 ml-2" /> {event.location}</p>
                                </div>
                                <Button onClick={() => { setActiveTab('events'); handleEditClick(event); }} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                              </div>
                           ))}
                           {events?.filter(e => e.festivalDayId === day.id).length === 0 && (
                            <p className="text-sm text-muted-foreground p-3">No events scheduled for this day.</p>
                           )}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="glass-panel border-accent/20 rounded-none bg-black/40 h-fit">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                            <Plus className="w-4 h-4 text-accent" /> New Briefing
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest">Title</Label>
                            <Input name="title" value={newAnnouncement.title} onChange={handleNewAnnouncementChange} placeholder="e.g. Schedule Update" className="bg-white/5 border-white/10 rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest">Content</Label>
                            <Textarea name="content" value={newAnnouncement.content} onChange={handleNewAnnouncementChange} placeholder="Details about the announcement..." className="bg-white/5 border-white/10 rounded-none min-h-[120px]" />
                        </div>
                        <Button onClick={handleAddAnnouncement} className="w-full bg-accent text-background hover:bg-accent/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                           Publish Briefing
                        </Button>
                    </CardContent>
                </Card>
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-headline text-xs tracking-widest text-accent uppercase mb-4">Published Briefings</h3>
                    {announcementsLoading && <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>}
                    {announcements?.map((announcement) => (
                        <div key={announcement.id} className="glass-panel p-4 border-white/5 bg-white/5 flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-headline text-md text-white tracking-widest uppercase">{announcement.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1 mb-2 font-code">{new Date(announcement.timestamp).toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground/80">{announcement.content}</p>
                            </div>
                            <Button onClick={() => handleDeleteAnnouncement(announcement.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 flex-shrink-0 ml-4">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40 h-fit">
              <CardHeader>
                 <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                    {editingArchitect ? <Pencil className="w-4 h-4 text-primary" /> : <UserPlus className="w-4 h-4" />}
                    {editingArchitect ? 'EDIT ARCHITECT' : 'RECRUIT ARCHITECT'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Display Order</Label>
                  <Input name="displayOrder" type="number" value={newArchitect.displayOrder} onChange={handleNewArchitectChange} placeholder="e.g. 1" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Student Name</Label>
                  <Input name="fullName" value={newArchitect.fullName} onChange={handleNewArchitectChange} placeholder="e.g. Jane Doe" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Role</Label>
                  <Input name="role" value={newArchitect.role} onChange={handleNewArchitectChange} placeholder="e.g. Student Organizer" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Category</Label>
                  <Select
                    name="category"
                    value={newArchitect.category}
                    onValueChange={handleArchitectCategoryChange}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                      {architectCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Image URL</Label>
                  <Input name="profileImageUrl" value={newArchitect.profileImageUrl} onChange={handleNewArchitectChange} placeholder="https://..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">LinkedIn URL</Label>
                  <Input name="linkedinUrl" value={newArchitect.linkedinUrl} onChange={handleNewArchitectChange} placeholder="https://linkedin.com/in/..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">GitHub URL (Optional)</Label>
                  <Input name="githubUrl" value={newArchitect.githubUrl} onChange={handleNewArchitectChange} placeholder="https://github.com/..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Portfolio URL (Optional)</Label>
                  <Input name="portfolioUrl" value={newArchitect.portfolioUrl} onChange={handleNewArchitectChange} placeholder="https://..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                 <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Resume URL (Optional)</Label>
                  <Input name="resumeUrl" value={newArchitect.resumeUrl} onChange={handleNewArchitectChange} placeholder="https://..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <Button onClick={editingArchitect ? handleUpdateArchitect : handleAddArchitect} className="w-full bg-accent text-background hover:bg-accent/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                  {editingArchitect ? 'UPDATE MEMBER' : 'ONBOARD MEMBER'}
                </Button>
                {editingArchitect && (
                    <Button onClick={handleCancelArchitectEdit} variant="secondary" className="w-full rounded-none font-headline tracking-widest text-[10px] py-4 uppercase mt-2">
                      CANCEL EDIT
                    </Button>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-headline text-xs tracking-widest text-primary uppercase mb-4">ACTIVE ARCHITECTS</h3>
              {teamMembersLoading && <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>}
              {sortedTeamMembers?.map((member, idx) => (
                  <div key={member.id} className="glass-panel p-4 border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-headline text-primary text-sm w-6 text-center">{idx + 1}.</span>
                      <Image src={member.profileImageUrl || '/favicon.ico'} alt={member.fullName} width={40} height={40} className="w-10 h-10 rounded-full object-cover bg-white/10" />
                      <div>
                        <h4 className="font-headline text-[11px] text-white tracking-widest uppercase">{member.fullName}</h4>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{member.role} - <span className="text-accent">{member.category}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button onClick={() => handleArchitectEditClick(member)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                          <Pencil className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDeleteArchitect(member.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="registrations">
          <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                  <Users className="w-5 h-5 text-accent" /> WARRIOR ARCHIVE
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest mt-1">
                  Live Manifest · {registrations?.length ?? 0} Total · {registrations?.filter((r: any) => r.paymentStatus === 'Verified').length ?? 0} Verified
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <Input
                  placeholder="Search by name / email / event..."
                  value={(typeof window !== 'undefined' ? (window as any).__regSearch : '') || ''}
                  onChange={e => { if (typeof window !== 'undefined') { (window as any).__regSearch = e.target.value; } }}
                  className="bg-white/5 border-white/10 rounded-none text-xs w-full sm:w-64"
                  id="reg-search-input"
                />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader className="border-white/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-widest">Leader / Order</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Contact</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Event</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Team</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Amount</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">UTR</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Payment</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Date</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationsLoading && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Loader2 className="mx-auto animate-spin" />
                      </TableCell>
                    </TableRow>
                  )}
                  {!registrationsLoading && (!registrations || registrations.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-12 text-muted-foreground text-xs uppercase tracking-widest">
                        No registrations yet. Warriors will appear here once they register.
                      </TableCell>
                    </TableRow>
                  )}
                  {registrations?.map((reg: any) => (
                    <TableRow key={reg.id} className="border-white/5 hover:bg-white/5 align-top">
                      {/* Leader / Order */}
                      <TableCell>
                        <p className="text-[10px] uppercase font-bold text-white tracking-widest">{reg.fullName || '—'}</p>
                        <p className="text-[9px] text-muted-foreground mt-0.5">{reg.university || reg.college || '—'}</p>
                        {reg.orderId && (
                          <p className="text-[9px] font-mono text-primary/70 mt-0.5">{reg.orderId}</p>
                        )}
                      </TableCell>
                      {/* Contact */}
                      <TableCell>
                        <p className="text-[10px] text-muted-foreground">{reg.email || '—'}</p>
                        <p className="text-[9px] text-muted-foreground/60 mt-0.5">{reg.phoneNumber || reg.phone || '—'}</p>
                        <p className="text-[9px] text-muted-foreground/50 mt-0.5">{reg.course || '—'}</p>
                      </TableCell>
                      {/* Event */}
                      <TableCell>
                        <span className="text-[9px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/20 font-headline uppercase block w-fit">
                          {reg.selectedEvent || reg.registeredEventIds?.[0] || 'N/A'}
                        </span>
                        {reg.eventCategory && (
                          <span className="text-[8px] text-accent/70 mt-1 block uppercase tracking-widest">{reg.eventCategory}</span>
                        )}
                        {reg.teamName && (
                          <span className="text-[9px] text-white/60 mt-1 block">🏷️ {reg.teamName}</span>
                        )}
                      </TableCell>
                      {/* Team size */}
                      <TableCell>
                        {reg.teamMembers && reg.teamMembers.length > 0 ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" className="h-auto p-0 text-[9px] text-accent hover:text-accent/80 uppercase tracking-widest font-headline">
                                {reg.teamMembers.length + 1} members ↗
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-panel border-primary/20 bg-black/80 rounded-none max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="font-headline uppercase tracking-widest text-primary text-sm">
                                  Team Members — {reg.teamName || reg.fullName}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-3 py-2 max-h-80 overflow-y-auto">
                                {/* Leader */}
                                <div className="glass-panel p-3 border border-primary/20">
                                  <p className="text-[9px] text-primary uppercase tracking-widest mb-1">Member 1 (Leader)</p>
                                  <p className="text-white text-xs font-bold">{reg.fullName}</p>
                                  <p className="text-muted-foreground text-[10px]">{reg.email} · {reg.phoneNumber}</p>
                                  <p className="text-muted-foreground/60 text-[9px]">{reg.university} · {reg.course}</p>
                                </div>
                                {/* Other members */}
                                {reg.teamMembers.map((m: any, i: number) => (
                                  <div key={i} className="glass-panel p-3 border border-white/10">
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest mb-1">Member {i + 2}</p>
                                    <p className="text-white text-xs font-bold">{m.name}</p>
                                    <p className="text-muted-foreground text-[10px]">{m.email} · {m.phone}</p>
                                    {(m.college || m.course) && (
                                      <p className="text-muted-foreground/60 text-[9px]">{m.college} · {m.course}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <span className="text-[9px] text-muted-foreground/50">Solo</span>
                        )}
                      </TableCell>
                      {/* Amount */}
                      <TableCell>
                        <span className="text-[11px] font-headline text-white">
                          {reg.amount ? `₹${reg.amount}` : '—'}
                        </span>
                      </TableCell>
                      {/* UTR */}
                      <TableCell>
                        <span className="text-[9px] font-mono text-muted-foreground select-all">
                          {reg.utrNumber || '—'}
                        </span>
                      </TableCell>
                      {/* Payment status */}
                      <TableCell>
                        {reg.paymentStatus === 'Verified' ? (
                          <Badge variant="outline" className="text-green-400 border-green-400/40 text-[9px] uppercase tracking-widest whitespace-nowrap">
                            <ShieldCheck className="w-3 h-3 mr-1" />Verified
                          </Badge>
                        ) : reg.paymentStatus === 'Pending' ? (
                          <Badge variant="outline" className="text-amber-400 border-amber-400/40 text-[9px] uppercase tracking-widest whitespace-nowrap">
                            <AlertTriangle className="w-3 h-3 mr-1" />Pending
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground border-muted-foreground/40 text-[9px] uppercase tracking-widest">
                            {reg.paymentStatus || 'N/A'}
                          </Badge>
                        )}
                      </TableCell>
                      {/* Date */}
                      <TableCell className="text-[9px] font-code text-muted-foreground/60 whitespace-nowrap">
                        {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                        <br />
                        {reg.registrationDate ? new Date(reg.registrationDate).toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' }) : ''}
                      </TableCell>
                      {/* Actions */}
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setEditingRegistration(reg)} className="text-muted-foreground hover:text-primary">
                          <Pencil className="w-4 h-4" />
                        </Button>

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-panel border-destructive/40 bg-black/60 rounded-none">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-headline text-destructive uppercase">Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Are you sure you want to delete the registration for <strong>{reg.fullName}</strong>? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-none uppercase text-xs tracking-widest">Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteRegistration(reg.id)} className="bg-destructive hover:bg-destructive/80 rounded-none uppercase text-xs tracking-widest">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Edit Registration Dialog (Moved outside table map) */}
          <Dialog open={!!editingRegistration} onOpenChange={(isOpen) => !isOpen && setEditingRegistration(null)}>
            <DialogContent className="glass-panel border-primary/20 bg-black/60 rounded-none max-w-md">
              <DialogHeader>
                <DialogTitle className="font-headline uppercase tracking-widest text-primary text-sm">Edit Registration</DialogTitle>
              </DialogHeader>
              {editingRegistration && (
                <div className="space-y-3 py-4 max-h-[70vh] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Full Name</Label>
                    <Input name="fullName" value={editingRegistration.fullName || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Email</Label>
                    <Input name="email" type="email" value={editingRegistration.email || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Phone</Label>
                    <Input name="phoneNumber" value={editingRegistration.phoneNumber || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Institution Name</Label>
                      <Input name="university" value={editingRegistration.university || editingRegistration.college || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Branch & Sem</Label>
                      <Input name="course" value={editingRegistration.course || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Event Name</Label>
                      <Input name="selectedEvent" value={editingRegistration.selectedEvent || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Category</Label>
                      <Input name="eventCategory" value={editingRegistration.eventCategory || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Team Name (If Applicable)</Label>
                    <Input name="teamName" value={editingRegistration.teamName || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Amount Paid</Label>
                      <Input name="amount" type="number" value={editingRegistration.amount || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">UTR Number</Label>
                      <Input name="utrNumber" value={editingRegistration.utrNumber || ''} onChange={handleRegistrationInputChange} className="bg-white/5 border-white/10 rounded-none font-mono" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Payment Status</Label>
                    <Select value={editingRegistration.paymentStatus || 'Pending'} onValueChange={(value) => handleRegistrationSelectChange('paymentStatus', value)}>
                      <SelectTrigger className="w-full bg-white/5 border-white/10 text-xs rounded-none text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                        <SelectItem value="Failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between glass-panel p-3 border border-white/10">
                    <Label htmlFor={`verify-switch-${editingRegistration.id}`} className="text-[10px] uppercase tracking-widest text-muted-foreground">Identity Verified</Label>
                    <Switch
                      id={`verify-switch-${editingRegistration.id}`}
                      checked={editingRegistration.isVerified || false}
                      onCheckedChange={(checked) => handleRegistrationSwitchChange('isVerified', checked)}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingRegistration(null)} className="rounded-none uppercase text-xs tracking-widest">Cancel</Button>
                <Button onClick={handleUpdateRegistration} className="bg-primary hover:bg-primary/80 rounded-none uppercase text-xs tracking-widest">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </TabsContent>

        <TabsContent value="admins">
          <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
            <CardHeader>
              <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                <KeySquare className="w-5 h-5 text-primary" /> ADMIN ROLE MANAGER
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest mt-1">Grant or revoke administrator privileges.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="border-white/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-widest">Identity</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsersLoading && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6">
                        <Loader2 className="mx-auto animate-spin w-6 h-6 text-primary" />
                      </TableCell>
                    </TableRow>
                  )}
                  {!adminUsersLoading && (!adminUsers || adminUsers.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-xs font-mono uppercase tracking-widest">
                        No admin accounts registered yet. Use the Signup form on /admin/auth to create one.
                      </TableCell>
                    </TableRow>
                  )}
                  {adminUsers?.map((adminUser) => {
                    const isApproved = adminUser.status === 'approved';
                    const isSuper = adminUser.role === 'superadmin';

                    return (
                      <TableRow key={adminUser.id} className="border-white/5 hover:bg-white/5">
                        <TableCell>
                          <div className="font-bold text-white tracking-widest uppercase text-[11px]">
                            {adminUser.username || adminUser.fullName}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{adminUser.email}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[9px] uppercase tracking-widest ${isSuper ? 'text-[#FF6B00] border-[#FF6B00]/40' : 'text-blue-400 border-blue-400/40'}`}>
                            {adminUser.role || 'admin'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {isApproved ? (
                            <Badge variant="outline" className="text-green-400 border-green-400/40 text-[9px] uppercase tracking-widest">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-amber-400 border-amber-400/40 text-[9px] uppercase tracking-widest">
                              <ShieldOff className="w-3 h-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant={isApproved ? "destructive" : "secondary"}
                              size="sm"
                              className="text-[10px] font-headline tracking-widest rounded-none uppercase"
                              onClick={() => handleToggleAdmin(adminUser.id, adminUser.status)}
                            >
                              {isApproved ? "Suspend" : "Approve"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive h-9 w-9"
                                  title="Delete admin account"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="glass-panel border-destructive/40 bg-black/60 rounded-none">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="font-headline text-destructive uppercase">Confirm Deletion</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    Are you sure you want to delete the admin account for <strong className="text-white">{adminUser.username}</strong> ({adminUser.email})? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-none uppercase text-xs tracking-widest">Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteAdminUser(adminUser.id)} className="bg-destructive hover:bg-destructive/80 rounded-none uppercase text-xs tracking-widest">Delete Admin</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
            <CardHeader>
              <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                <MessageSquare className="w-5 h-5 text-primary" /> Incoming Transmissions
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest mt-1">Direct messages from users.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="border-white/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-widest">From</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Message</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Received</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactMessagesLoading && (
                      <TableRow>
                          <TableCell colSpan={4} className="text-center">
                              <Loader2 className="mx-auto animate-spin" />
                          </TableCell>
                      </TableRow>
                  )}
                  {contactMessages?.map((message) => (
                    <TableRow key={message.id} className={`border-white/5 hover:bg-white/5 ${!message.isRead ? 'bg-primary/10' : ''}`}>
                      <TableCell>
                          <div className={`font-bold text-white tracking-widest uppercase text-[11px] ${!message.isRead ? 'text-primary' : ''}`}>{message.name}</div>
                          <div className="text-[10px] text-muted-foreground">{message.email}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-md">{message.message}</TableCell>
                      <TableCell className="text-[10px] font-code text-muted-foreground/60">{new Date(message.submittedAt).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleRead(message.id, message.isRead)}
                              title={message.isRead ? 'Mark as unread' : 'Mark as read'}
                          >
                              {message.isRead ? <Mail className="w-4 h-4 text-muted-foreground" /> : <Mail className="w-4 h-4 text-primary" />}
                          </Button>
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteMessage(message.id)}
                              className="text-muted-foreground hover:text-destructive"
                              title="Delete message"
                          >
                              <Trash2 className="w-4 h-4" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    