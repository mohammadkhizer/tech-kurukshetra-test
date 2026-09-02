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
  Star,
  MessageSquareHeart,
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

function AdminSponsorRow({ sponsor, onDelete }: { sponsor: any; onDelete: (id: string) => void }) {
  const [imgErr, setImgErr] = useState(false);
  const logoUrl = decodeHtmlEntities(sponsor.logoUrl || '');

  return (
    <div className="glass-panel p-4 border-white/5 bg-white/5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 glass-panel flex items-center justify-center p-1 bg-[#111] border border-white/10 relative overflow-hidden rounded">
          {logoUrl && !imgErr ? (
            <img
              src={logoUrl}
              alt={sponsor.name}
              onError={() => setImgErr(true)}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-xs font-bold text-[#FF6B00] font-headline tracking-widest uppercase">
              {sponsor.name?.substring(0, 2) || 'SP'}
            </span>
          )}
        </div>
        <div>
          <h4 className="font-headline text-[11px] text-white tracking-widest uppercase">{sponsor.name}</h4>
          <p className="text-[8px] text-[#FF6B00] uppercase tracking-widest font-bold">{sponsor.tier || sponsor.category || 'Partner'}</p>
        </div>
      </div>
      <Button onClick={() => onDelete(sponsor.id)} variant="ghost" className="text-muted-foreground hover:text-destructive p-2">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

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
  const { data: feedbackList, isLoading: feedbackLoading, refetch: refetchFeedback } = useFetch<any[]>(isAuthorized ? '/api/admin/feedback' : null);

  const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
  const [feedbackRatingFilter, setFeedbackRatingFilter] = useState<string>('ALL');
  const [feedbackEventFilter, setFeedbackEventFilter] = useState<string>('ALL');
  const [feedbackSearch, setFeedbackSearch] = useState<string>('');

  const handleDeleteFeedback = async (id: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        toast({ title: "Feedback Deleted", description: "Feedback submission removed." });
        refetchFeedback();
      } else {
        toast({ variant: "destructive", title: "Delete Failed", description: json.message || "Failed to delete feedback." });
      }
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "Could not delete feedback." });
    }
  };

  const filteredFeedback = useMemo(() => {
    if (!feedbackList) return [];
    return feedbackList.filter((f) => {
      if (feedbackRatingFilter === 'LOW' && f.rating > 2) return false;
      if (['1', '2', '3', '4', '5'].includes(feedbackRatingFilter) && String(f.rating) !== feedbackRatingFilter) return false;
      if (feedbackEventFilter !== 'ALL') {
        const eventsArr = Array.isArray(f.eventsAttended) ? f.eventsAttended : [];
        if (!eventsArr.includes(feedbackEventFilter)) return false;
      }
      if (feedbackSearch.trim()) {
        const q = feedbackSearch.toLowerCase().trim();
        const nameMatch = f.name?.toLowerCase().includes(q);
        const emailMatch = f.email?.toLowerCase().includes(q);
        const improvementsMatch = f.improvements?.toLowerCase().includes(q);
        const likedMatch = f.likedMost?.toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !improvementsMatch && !likedMatch) return false;
      }
      return true;
    });
  }, [feedbackList, feedbackRatingFilter, feedbackEventFilter, feedbackSearch]);

  const allFeedbackEvents = useMemo(() => {
    if (!feedbackList) return [];
    const set = new Set<string>();
    feedbackList.forEach((f) => {
      if (Array.isArray(f.eventsAttended)) {
        f.eventsAttended.forEach((ev: string) => set.add(ev));
      }
    });
    return Array.from(set);
  }, [feedbackList]);

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
    eventDate: '',
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
    if (!newEvent.duration.trim()) return { error: "Duration is required." };
    if (!newEvent.prizePool.trim()) return { error: "Prize Pool is required." };
    if (!newEvent.registrationDeadline) return { error: "Registration Deadline date is required." };

    // Date check: registrationDeadline must be on or before Event Date / Festival Day
    const selectedDay = festivalDays?.find((d: any) => d.id === newEvent.festivalDayId);
    const finalDate = newEvent.eventDate || selectedDay?.date || newEvent.festivalDayId || '';
    if (finalDate && newEvent.registrationDeadline > finalDate.substring(0, 10)) {
      return { error: `Registration Deadline (${newEvent.registrationDeadline}) must be on or before Event Date (${finalDate.substring(0, 10)}).` };
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
      date: finalDate,
      festivalDayId: newEvent.festivalDayId,
      time: newEvent.startTime.trim() || 'TBA',
      startTime: newEvent.startTime.trim() || 'TBA',
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
      eventDate: event.date ? event.date.substring(0, 10) : '',
      festivalDayId: event.festivalDayId || '',
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
      eventDate: '',
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
      if (!id) {
        toast({ variant: "destructive", title: "Error", description: "Invalid registration ID." });
        return;
      }

      // Optimistically remove record from UI state instantly
      setRegistrations((prev) => prev.filter((r) => r.id !== id && r.orderId !== id));

      try {
        const res = await fetch(`/api/admin/registrations/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        const json = await res.json();
        if (res.ok && json.success) {
          toast({ title: "Registration Deleted", description: "The participant's record has been removed." });
          await fetchRegistrations();
        } else {
          toast({ variant: "destructive", title: "Deletion Failed", description: json.message || "Could not delete record." });
          await fetchRegistrations(); // Rollback / resync
        }
      } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete participant." });
        await fetchRegistrations(); // Rollback / resync
      }
    };
    
    const handleUpdateRegistration = async () => {
      if (!editingRegistration) return;
      const { id, orderId, ...dataToUpdate } = editingRegistration;
      const targetId = id || orderId;

      if (!targetId) {
        toast({ variant: "destructive", title: "Error", description: "Invalid registration ID." });
        return;
      }
      
      setRegistrationsLoading(true);
      try {
        const res = await fetch(`/api/admin/registrations/${encodeURIComponent(targetId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToUpdate),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          toast({ title: "Registration Updated", description: "Participant details have been saved." });
          setEditingRegistration(null);
          await fetchRegistrations();
        } else {
          toast({ variant: "destructive", title: "Update Failed", description: json.message || "Failed to update participant." });
        }
      } catch (e: any) {
        toast({ variant: "destructive", title: "Error", description: "Failed to update participant." });
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
            <TabsTrigger value="feedback" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase whitespace-nowrap">Feedback</TabsTrigger>
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
                <AdminSponsorRow key={sponsor.id} sponsor={sponsor} onDelete={handleDeleteSponsor} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="space-y-8">
            {/* Redesigned Admin Add/Edit Arena Form Header */}
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase text-primary font-black">
                    {editingEvent ? <Pencil className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                    {editingEvent ? `EDIT ARENA: ${editingEvent.name}` : 'ADD NEW ARENA'}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1">
                    Manage festival battleground metadata, team rules, fee structure, and contact points.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCardPreview(!showCardPreview)}
                    className="border-primary/40 text-primary hover:bg-primary/10 rounded-none text-xs font-headline tracking-widest uppercase"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showCardPreview ? 'Hide Preview' : 'Live Card Preview'}
                  </Button>
                  <Button
                    onClick={handleSeedDatabase}
                    variant="outline"
                    className="border-accent/30 text-accent hover:bg-accent/10 rounded-none font-headline tracking-widest text-xs uppercase"
                  >
                    <DatabaseZap className="w-4 h-4 mr-2" /> SEED DEFAULT ARENAS
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Live Card Preview Panel */}
                {showCardPreview && (
                  <div className="glass-panel p-5 border-primary/40 bg-primary/[0.04] rounded-none mb-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-headline font-bold text-primary tracking-widest uppercase flex items-center gap-2">
                        <Eye className="w-4 h-4" /> PREVIEW: PUBLIC ARENA CARD ON /ARENAS
                      </span>
                      <Badge variant="outline" className="text-[10px] border-primary/40 text-primary uppercase rounded-none font-headline tracking-wider">
                        {newEvent.category || 'TECH'}
                      </Badge>
                    </div>

                    <div className="border border-white/10 p-5 bg-black/90 space-y-4 max-w-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-2.5 bg-primary/10 border border-primary/30 text-primary">
                          <Gamepad2 className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-0.5 text-[10px] font-headline font-bold tracking-widest uppercase border border-primary/30 text-primary bg-primary/10">
                          {newEvent.category || 'TECH'}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-black tracking-tight font-headline text-white mb-1">
                          {newEvent.name || 'Arena Title Placeholder'}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {newEvent.description || 'Arena description will appear here...'}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-xs">
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

                      <div className="text-[10px] text-muted-foreground pt-2 flex justify-between border-t border-white/10">
                        <span>Venue: {newEvent.location || 'TBA'}</span>
                        <span className="text-primary font-bold">Fee: {newEvent.isFree ? 'Free' : (newEvent.registrationFee || 'Free')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6 Structured Cards in 2-Column Responsive Grid (768px-1024px tablet friendly) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* CARD 1: BASIC INFORMATION */}
                  <Card className="glass-panel border-primary/20 bg-black/60 rounded-none">
                    <CardHeader className="pb-3 border-b border-white/10">
                      <CardTitle className="font-headline text-xs tracking-widest uppercase flex items-center gap-2 text-primary font-bold">
                        <Info className="w-4 h-4" /> 1. Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      {/* Event Name */}
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-widest">Event Name <span className="text-destructive">*</span></Label>
                        <Input
                          name="name"
                          value={newEvent.name}
                          onChange={handleNewEventChange}
                          onBlur={handleNameBlur}
                          placeholder="e.g. Cyber Strike Arena"
                          className={`bg-white/5 border-white/10 rounded-none text-white text-xs ${!newEvent.name.trim() ? 'border-red-500/40' : ''}`}
                        />
                      </div>

                      {/* Slug / ID */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] uppercase tracking-widest">Arena ID / Slug <span className="text-destructive">*</span></Label>
                          <button
                            type="button"
                            onClick={handleNameBlur}
                            className="text-[9px] text-primary hover:underline uppercase tracking-wider font-semibold"
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
                        <p className="text-[9px] text-muted-foreground">Unique URL identifier (kebab-case).</p>
                      </div>

                      {/* Category (TECH vs NON-TECH) */}
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-widest">Category <span className="text-destructive">*</span></Label>
                        <Select value={newEvent.category} onValueChange={handleEventCategoryChange}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/95 border-white/10 text-white rounded-none">
                            <SelectItem value="TECH">TECH (Technical Events)</SelectItem>
                            <SelectItem value="NON-TECH">NON-TECH (Sports, Gaming &amp; Cultural)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Description + Character Counter */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] uppercase tracking-widest">Event Description <span className="text-destructive">*</span></Label>
                          <span className={`text-[9px] font-mono ${newEvent.description.length < 50 ? 'text-amber-400' : 'text-primary'}`}>
                            {newEvent.description.length} chars (2-3 lines guidance)
                          </span>
                        </div>
                        <Textarea
                          name="description"
                          value={newEvent.description}
                          onChange={handleNewEventChange}
                          rows={3}
                          placeholder="Provide a concise 2-3 sentence overview of the arena mission..."
                          className="bg-white/5 border-white/10 rounded-none text-white text-xs leading-relaxed"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* CARD 2: FORMAT & TEAM CONSTRAINTS */}
                  <Card className="glass-panel border-primary/20 bg-black/60 rounded-none">
                    <CardHeader className="pb-3 border-b border-white/10">
                      <CardTitle className="font-headline text-xs tracking-widest uppercase flex items-center gap-2 text-primary font-bold">
                        <Users className="w-4 h-4" /> 2. Format &amp; Team Constraints
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      {/* Format Toggle */}
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-widest">Participation Format <span className="text-destructive">*</span></Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            type="button"
                            variant={newEvent.type === 'solo' ? 'default' : 'outline'}
                            onClick={() => handleEventTypeChange('solo')}
                            className={`rounded-none text-xs uppercase font-headline tracking-widest ${newEvent.type === 'solo' ? 'bg-primary text-background font-black' : 'border-white/10 text-white'}`}
                          >
                            Solo Event
                          </Button>
                          <Button
                            type="button"
                            variant={newEvent.type === 'team' ? 'default' : 'outline'}
                            onClick={() => handleEventTypeChange('team')}
                            className={`rounded-none text-xs uppercase font-headline tracking-widest ${newEvent.type === 'team' ? 'bg-primary text-background font-black' : 'border-white/10 text-white'}`}
                          >
                            Team Event
                          </Button>
                        </div>
                      </div>

                      {/* Team Size Min / Max */}
                      {newEvent.type === 'team' ? (
                        <div className="space-y-3 p-3 glass-panel border-white/10 bg-white/5 rounded-none">
                          <div className="text-[9px] uppercase tracking-widest text-primary font-semibold">Team Size Boundaries</div>
                          <div className="grid grid-cols-2 gap-3">
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
                          {newEvent.maxTeamSize < newEvent.minTeamSize && (
                            <p className="text-[9px] text-destructive">Max team size must be greater than or equal to min team size.</p>
                          )}
                          {newEvent.minTeamSize === newEvent.maxTeamSize && (
                            <p className="text-[9px] text-primary">Fixed team size of {newEvent.minTeamSize} players.</p>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 border border-white/10 bg-white/5 text-xs text-muted-foreground rounded-none">
                          Solo format automatically locks team size to <span className="text-white font-mono font-bold">1 Player</span>.
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* CARD 3: SCHEDULE & LOCATION */}
                  <Card className="glass-panel border-primary/20 bg-black/60 rounded-none">
                    <CardHeader className="pb-3 border-b border-white/10">
                      <CardTitle className="font-headline text-xs tracking-widest uppercase flex items-center gap-2 text-primary font-bold">
                        <CalendarIcon className="w-4 h-4" /> 3. Schedule &amp; Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      {/* Date & Time */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-widest">Event Date <span className="text-destructive">*</span></Label>
                          <Input
                            type="date"
                            name="eventDate"
                            value={newEvent.eventDate}
                            onChange={handleNewEventChange}
                            className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-widest">Start Time <span className="text-destructive">*</span></Label>
                          <Input
                            type="text"
                            name="startTime"
                            value={newEvent.startTime}
                            onChange={handleNewEventChange}
                            placeholder="e.g. 09:00 AM"
                            className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Duration & Venue */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-widest">Duration <span className="text-destructive">*</span></Label>
                          <Input
                            name="duration"
                            value={newEvent.duration}
                            onChange={handleNewEventChange}
                            placeholder="e.g. 24 Hours, 3 Hours"
                            className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-widest">Venue / Location <span className="text-destructive">*</span></Label>
                          <Input
                            name="location"
                            value={newEvent.location}
                            onChange={handleNewEventChange}
                            placeholder="e.g. Lab 302, Main Ground"
                            className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                          />
                        </div>
                      </div>

                      {/* Festival Day */}
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-widest">Festival Day <span className="text-destructive">*</span></Label>
                        <Select value={newEvent.festivalDayId} onValueChange={handleEventDayChange}>
                          <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto">
                            <SelectValue placeholder="Select Festival Day" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/95 border-white/10 text-white rounded-none">
                            {festivalDays && festivalDays.length > 0 ? (
                              festivalDays.map(day => (
                                <SelectItem key={day.id} value={day.id}>{day.name} ({day.date || 'TBA'})</SelectItem>
                              ))
                            ) : (
                              <SelectItem value="Day 1">Day 1 (Jan 20)</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CARD 4: PRIZE POOL & FEES */}
                  <Card className="glass-panel border-primary/20 bg-black/60 rounded-none">
                    <CardHeader className="pb-3 border-b border-white/10">
                      <CardTitle className="font-headline text-xs tracking-widest uppercase flex items-center gap-2 text-primary font-bold">
                        <Rocket className="w-4 h-4" /> 4. Prize Pool &amp; Fees
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      {/* Prize Pool */}
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase tracking-widest">Prize Pool <span className="text-destructive">*</span></Label>
                        <Input
                          name="prizePool"
                          value={newEvent.prizePool}
                          onChange={handleNewEventChange}
                          placeholder="e.g. ₹50,000 or Trophies &amp; Certificates"
                          className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                        />
                      </div>

                      {/* Entry Fee & Free Checkbox */}
                      <div className="space-y-2 p-3 glass-panel border-white/10 bg-white/5 rounded-none">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] uppercase tracking-widest text-primary font-semibold">Entry Fee Structure</Label>
                          <label className="flex items-center gap-2 text-xs text-primary cursor-pointer font-headline uppercase text-[10px] tracking-wider font-bold">
                            <input
                              type="checkbox"
                              checked={newEvent.isFree}
                              onChange={(e) => setNewEvent(prev => ({ ...prev, isFree: e.target.checked }))}
                              className="accent-primary w-3.5 h-3.5"
                            />
                            Free Entry
                          </label>
                        </div>
                        {!newEvent.isFree && (
                          <div className="space-y-1">
                            <Label className="text-[9px] uppercase tracking-widest">Entry Fee Amount (INR)</Label>
                            <Input
                              name="registrationFee"
                              value={newEvent.registrationFee}
                              onChange={handleNewEventChange}
                              placeholder="e.g. 100 or ₹100"
                              className="bg-white/5 border-white/10 rounded-none text-white text-xs h-8"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* CARD 5: COORDINATOR CONTACT */}
                  <Card className="glass-panel border-primary/20 bg-black/60 rounded-none md:col-span-2">
                    <CardHeader className="pb-3 border-b border-white/10">
                      <CardTitle className="font-headline text-xs tracking-widest uppercase flex items-center gap-2 text-primary font-bold">
                        <Mail className="w-4 h-4" /> 5. Coordinator Contact (3 Required Sub-Fields)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-widest">Contact Name <span className="text-destructive">*</span></Label>
                          <Input
                            name="coordinatorContactName"
                            value={newEvent.coordinatorContactName}
                            onChange={handleNewEventChange}
                            placeholder="e.g. Alex Vance"
                            className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-widest">Contact Phone <span className="text-destructive">*</span></Label>
                          <Input
                            name="coordinatorContactPhone"
                            value={newEvent.coordinatorContactPhone}
                            onChange={handleNewEventChange}
                            placeholder="+91 9876543210"
                            className={`bg-white/5 border-white/10 rounded-none text-white text-xs ${
                              newEvent.coordinatorContactPhone && !isValidPhone(newEvent.coordinatorContactPhone) ? 'border-red-500' : ''
                            }`}
                          />
                          {newEvent.coordinatorContactPhone && !isValidPhone(newEvent.coordinatorContactPhone) && (
                            <p className="text-[9px] text-destructive">Format: 7 to 15 digits (e.g. +91 9876543210)</p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase tracking-widest">Contact Email <span className="text-destructive">*</span></Label>
                          <Input
                            name="coordinatorContactEmail"
                            value={newEvent.coordinatorContactEmail}
                            onChange={handleNewEventChange}
                            placeholder="coordinator@svgu.ac.in"
                            className={`bg-white/5 border-white/10 rounded-none text-white text-xs ${
                              newEvent.coordinatorContactEmail && !isValidEmail(newEvent.coordinatorContactEmail) ? 'border-red-500' : ''
                            }`}
                          />
                          {newEvent.coordinatorContactEmail && !isValidEmail(newEvent.coordinatorContactEmail) && (
                            <p className="text-[9px] text-destructive">Invalid email address format.</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CARD 6: MEDIA, DEADLINES & RULES */}
                  <Card className="glass-panel border-primary/20 bg-black/60 rounded-none md:col-span-2">
                    <CardHeader className="pb-3 border-b border-white/10">
                      <CardTitle className="font-headline text-xs tracking-widest uppercase flex items-center gap-2 text-primary font-bold">
                        <FileText className="w-4 h-4" /> 6. Media, Guidelines &amp; Deadlines
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Banner Image URL + Live Thumbnail Preview */}
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest">Banner / Logo Image URL</Label>
                          <Input
                            name="imageUrl"
                            value={newEvent.imageUrl}
                            onChange={handleNewEventChange}
                            placeholder="/images/events/hackathon-banner.jpg or https://..."
                            className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                          />
                          {/* Live Thumbnail Preview */}
                          {newEvent.imageUrl && (
                            <div className="mt-2 p-2 border border-primary/30 bg-black/60 rounded-none flex items-center gap-3">
                              <div className="relative w-16 h-12 bg-white/5 overflow-hidden border border-white/10 flex-shrink-0">
                                <img
                                  src={newEvent.imageUrl}
                                  alt="Banner Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                                />
                              </div>
                              <div className="text-[9px] text-muted-foreground truncate font-mono">
                                <span className="text-primary font-bold uppercase block">Live Banner Thumbnail</span>
                                {newEvent.imageUrl}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Registration Deadline */}
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase tracking-widest">Registration Deadline <span className="text-destructive">*</span></Label>
                          <Input
                            type="date"
                            name="registrationDeadline"
                            value={newEvent.registrationDeadline}
                            onChange={handleNewEventChange}
                            className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                          />
                          <p className="text-[9px] text-muted-foreground">Must be on or before the event date.</p>
                        </div>
                      </div>

                      {/* Rules Add/Remove List */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <Label className="text-[10px] uppercase tracking-widest text-primary font-semibold">Rules &amp; Guidelines List</Label>
                        <div className="flex gap-2">
                          <Input
                            value={currentRule}
                            onChange={(e) => setCurrentRule(e.target.value)}
                            placeholder="Type a rule and press Enter or click Add"
                            className="bg-white/5 border-white/10 rounded-none text-white text-xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddRule();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={handleAddRule}
                            className="bg-primary hover:bg-primary/80 rounded-none px-4 text-background text-xs uppercase font-headline tracking-widest font-bold"
                          >
                            Add Rule
                          </Button>
                        </div>

                        <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                          {newEvent.rules.length > 0 ? (
                            newEvent.rules.map((rule, index) => (
                              <div key={index} className="flex items-center justify-between text-xs glass-panel p-2 border-white/10 bg-white/5 rounded-none">
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
                            ))
                          ) : (
                            <p className="text-[10px] text-muted-foreground text-center py-2">No rules added yet.</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                </div>

                {/* Submit Buttons */}
                <div className="space-y-2 pt-4">
                  <Button
                    onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                    className="w-full bg-primary text-background hover:bg-primary/90 rounded-none font-headline tracking-widest text-xs py-6 uppercase font-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingEvent ? 'SAVE & UPDATE ARENA METADATA' : 'INITIALIZE & SAVE NEW ARENA'}
                  </Button>

                  {editingEvent && (
                    <Button
                      onClick={handleCancelEdit}
                      variant="secondary"
                      className="w-full rounded-none font-headline tracking-widest text-xs py-4 uppercase"
                    >
                      CANCEL EDITING
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Arenas List Section */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-headline text-sm tracking-widest text-primary uppercase font-bold flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" /> ACTIVE FESTIVAL ARENAS IN DATABASE ({events?.length || 0})
                </h3>
              </div>
              
              {eventsLoading && <div className="text-center py-8"><Loader2 className="mx-auto animate-spin text-primary" /></div>}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {events?.map((event) => (
                  <div key={event.id || event._id} className="glass-panel p-4 border-white/10 bg-black/60 flex flex-col justify-between space-y-3 rounded-none">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[9px] border-primary/40 text-primary uppercase rounded-none font-headline tracking-wider">
                          {event.category || 'TECH'}
                        </Badge>
                        <span className="text-[9px] font-mono text-muted-foreground uppercase">{event.type || 'team'}</span>
                      </div>
                      <h4 className="font-headline text-sm font-bold text-white tracking-widest uppercase truncate">{event.name}</h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-2">{event.description}</p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="text-[9px] font-mono text-primary font-bold">
                        {event.prizePool || event.prize || 'TBA'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => handleEditClick(event)}
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-white hover:bg-primary/20 h-7 text-[10px] uppercase font-headline tracking-wider px-2"
                        >
                          <Pencil className="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteEvent(event.id || event._id)}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-7 text-[10px] uppercase font-headline tracking-wider px-2"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                              <AlertDialogAction onClick={() => handleDeleteRegistration(reg.id || reg.orderId)} className="bg-destructive hover:bg-destructive/80 rounded-none uppercase text-xs tracking-widest">Delete</AlertDialogAction>
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

        <TabsContent value="feedback" className="space-y-6">
          <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
            <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                  <MessageSquareHeart className="w-5 h-5 text-accent" /> PARTICIPANT FEEDBACK ARCHIVE
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest mt-1">
                  Live Submissions · {feedbackList?.length ?? 0} Total · Avg Rating: {
                    feedbackList && feedbackList.length > 0
                      ? (feedbackList.reduce((acc: number, f: any) => acc + (Number(f.rating) || 0), 0) / feedbackList.length).toFixed(1)
                      : '0.0'
                  }/5
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Input
                  placeholder="Search by name / email / feedback..."
                  value={feedbackSearch}
                  onChange={(e) => setFeedbackSearch(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-none text-xs w-full sm:w-60"
                />
                <Select value={feedbackRatingFilter} onValueChange={setFeedbackRatingFilter}>
                  <SelectTrigger className="w-full sm:w-44 bg-white/5 border-white/10 text-xs rounded-none text-white">
                    <SelectValue placeholder="Rating Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white rounded-none">
                    <SelectItem value="ALL">All Ratings</SelectItem>
                    <SelectItem value="LOW">🔻 Low Ratings (1-2★)</SelectItem>
                    <SelectItem value="1">1 Star (★☆☆☆☆)</SelectItem>
                    <SelectItem value="2">2 Stars (★★☆☆☆)</SelectItem>
                    <SelectItem value="3">3 Stars (★★★☆☆)</SelectItem>
                    <SelectItem value="4">4 Stars (★★★★☆)</SelectItem>
                    <SelectItem value="5">5 Stars (★★★★★)</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={feedbackEventFilter} onValueChange={setFeedbackEventFilter}>
                  <SelectTrigger className="w-full sm:w-44 bg-white/5 border-white/10 text-xs rounded-none text-white">
                    <SelectValue placeholder="Event Filter" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10 text-white rounded-none">
                    <SelectItem value="ALL">All Arenas</SelectItem>
                    {allFeedbackEvents.map((ev) => (
                      <SelectItem key={ev} value={ev}>{ev}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader className="border-white/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-widest">Participant</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Contact</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Events Attended</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Rating</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Improvements Excerpt</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Recommend</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Date</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbackLoading && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <Loader2 className="mx-auto animate-spin" />
                      </TableCell>
                    </TableRow>
                  )}
                  {!feedbackLoading && (!filteredFeedback || filteredFeedback.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-xs uppercase tracking-widest">
                        No feedback submissions found matching selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                  {filteredFeedback?.map((fb: any) => (
                    <TableRow key={fb.id || fb._id} className="border-white/5 hover:bg-white/5 align-top">
                      <TableCell>
                        <p className="text-[10px] uppercase font-bold text-white tracking-widest">{fb.name || '—'}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-[10px] text-muted-foreground">{fb.email || '—'}</p>
                        {fb.phone && <p className="text-[9px] text-muted-foreground/60 mt-0.5">{fb.phone}</p>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {Array.isArray(fb.eventsAttended) && fb.eventsAttended.length > 0 ? (
                            fb.eventsAttended.map((e: string, i: number) => (
                              <span key={i} className="text-[8px] px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/20 font-mono uppercase">
                                {e}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9px] text-muted-foreground">General</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-[10px] font-bold text-accent whitespace-nowrap">
                          {'★'.repeat(Math.max(1, Math.min(5, fb.rating || 1)))} ({fb.rating}/5)
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-muted-foreground/90 max-w-xs truncate" title={fb.improvements}>
                          {fb.improvements || '—'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[9px] uppercase tracking-widest ${
                            fb.wouldRecommend === 'Yes'
                              ? 'text-green-400 border-green-400/40'
                              : fb.wouldRecommend === 'No'
                              ? 'text-red-400 border-red-400/40'
                              : 'text-amber-400 border-amber-400/40'
                          }`}
                        >
                          {fb.wouldRecommend || '—'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[9px] font-code text-muted-foreground/60 whitespace-nowrap">
                        {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedFeedback(fb)}
                          className="text-muted-foreground hover:text-primary mr-1"
                          title="View Full Feedback"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" title="Delete Feedback">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="glass-panel border-destructive/40 bg-black/60 rounded-none">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="font-headline text-destructive uppercase">Confirm Deletion</AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                Are you sure you want to delete the feedback submission from <strong>{fb.name}</strong>? This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-none uppercase text-xs tracking-widest">Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteFeedback(fb.id || fb._id)}
                                className="bg-destructive hover:bg-destructive/80 rounded-none uppercase text-xs tracking-widest"
                              >
                                Delete Feedback
                              </AlertDialogAction>
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

          {/* Full Feedback Detail Dialog */}
          <Dialog open={!!selectedFeedback} onOpenChange={(open) => !open && setSelectedFeedback(null)}>
            <DialogContent className="glass-panel border-primary/20 bg-black/80 rounded-none max-w-xl">
              <DialogHeader>
                <DialogTitle className="font-headline uppercase tracking-widest text-primary text-sm flex items-center gap-2">
                  <MessageSquareHeart size={16} /> Feedback Submission Details — {selectedFeedback?.name}
                </DialogTitle>
              </DialogHeader>
              {selectedFeedback && (
                <div className="space-y-4 py-3 text-xs text-white">
                  <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 border border-white/10">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Participant Name</p>
                      <p className="font-bold text-white text-sm mt-0.5">{selectedFeedback.name}</p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Email Address</p>
                      <p className="text-primary mt-0.5">{selectedFeedback.email}</p>
                    </div>
                    {selectedFeedback.phone && (
                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Phone Number</p>
                        <p className="text-white mt-0.5">{selectedFeedback.phone}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Submitted At</p>
                      <p className="text-muted-foreground mt-0.5">
                        {selectedFeedback.createdAt ? new Date(selectedFeedback.createdAt).toLocaleString() : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 border border-white/10">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Overall Rating</p>
                      <p className="text-accent font-bold text-sm mt-0.5">
                        {'★'.repeat(Math.max(1, Math.min(5, selectedFeedback.rating || 1)))} ({selectedFeedback.rating}/5)
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Would Recommend?</p>
                      <p className="font-bold text-white mt-0.5">{selectedFeedback.wouldRecommend || '—'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">Event(s) Attended</p>
                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(selectedFeedback.eventsAttended) && selectedFeedback.eventsAttended.length > 0 ? (
                        selectedFeedback.eventsAttended.map((ev: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 bg-accent/10 border border-accent/20 text-accent font-mono text-[10px]">
                            {ev}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">General/Overall</span>
                      )}
                    </div>
                  </div>

                  {selectedFeedback.likedMost && (
                    <div className="bg-green-500/10 border-l-4 border-green-500 p-3.5 space-y-1">
                      <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">WHAT THEY LIKED MOST</p>
                      <p className="text-green-100 whitespace-pre-wrap leading-relaxed">{selectedFeedback.likedMost}</p>
                    </div>
                  )}

                  <div className="bg-orange-500/10 border-l-4 border-orange-500 p-3.5 space-y-1">
                    <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">WHAT COULD BE IMPROVED</p>
                    <p className="text-orange-100 whitespace-pre-wrap leading-relaxed">{selectedFeedback.improvements}</p>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedFeedback(null)} className="rounded-none uppercase text-xs tracking-widest">
                  Close Detail
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    