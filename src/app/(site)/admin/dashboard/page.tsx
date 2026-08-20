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
import { decodeHtmlEntities } from '@/lib/sanitizer';

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
  
  const [currentRule, setCurrentRule] = useState('');
  const [newEvent, setNewEvent] = useState({
    name: '',
    type: 'Technical',
    description: '',
    eventHead: '',
    rules: [] as string[],
    registrationFee: '',
    organiserContact: '',
    imageUrl: '',
    startTime: '',
    location: '',
    festivalDayId: '',
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

  const handleUpdateHero = () => {
      toast({ title: "Protocol Updated", description: "Hero section content has been saved." });
  };
  
  const handleUpdateCounters = () => {
      toast({ title: "Protocol Updated", description: "Homepage counters have been saved." });
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
  
  const handleEventTypeChange = (value: string) => {
    setNewEvent(prev => ({...prev, type: value}));
  };
  
  const handleEventDayChange = (value: string) => {
    setNewEvent(prev => ({ ...prev, festivalDayId: value }));
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

  const handleAddEvent = async () => {
    if (!newEvent.name) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Event name is required." });
        return;
    }
    const slug = newEvent.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    const eventData = {
        ...newEvent,
        slug: slug,
        isTechnical: newEvent.type === 'Technical',
        longDescription: newEvent.description,
        rules: newEvent.rules,
        startTime: newEvent.startTime ? new Date(newEvent.startTime).toISOString() : '',
        color: newEvent.type === 'Technical' ? "text-primary" : "text-accent",
    };
    await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    refetchEvents();
    handleCancelEdit();
    toast({ title: "Arena Initialized", description: `${newEvent.name} has been added.` });
  };

  const handleDeleteEvent = async (id: string) => {
      await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
      refetchEvents();
      toast({ title: "Arena Decommissioned", description: "Event removed from the schedule." });
  };

  const handleEditClick = (event: any) => {
    setEditingEvent(event);
    setNewEvent({
        name: event.name || '',
        type: event.type || 'Technical',
        description: event.description || '',
        eventHead: event.eventHead || '',
        rules: Array.isArray(event.rules) ? event.rules : [],
        registrationFee: event.registrationFee || '',
        organiserContact: event.organiserContact || '',
        imageUrl: event.imageUrl || '',
        startTime: event.startTime ? new Date(event.startTime).toISOString().substring(0, 16) : '',
        location: event.location || '',
        festivalDayId: event.festivalDayId || '',
    });
    setCurrentRule('');
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setNewEvent({ name: '', type: 'Technical', description: '', eventHead: '', rules: [], registrationFee: '', organiserContact: '', imageUrl: '', startTime: '', location: '', festivalDayId: '' });
    setCurrentRule('');
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent) return;

    if (!newEvent.name) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Event name is required." });
        return;
    }

    const updateData = {
        name: newEvent.name,
        type: newEvent.type,
        isTechnical: newEvent.type === 'Technical',
        description: newEvent.description,
        longDescription: newEvent.description,
        eventHead: newEvent.eventHead,
        rules: newEvent.rules,
        registrationFee: newEvent.registrationFee,
        organiserContact: newEvent.organiserContact,
        imageUrl: newEvent.imageUrl,
        startTime: newEvent.startTime ? new Date(newEvent.startTime).toISOString() : '',
        location: newEvent.location,
        festivalDayId: newEvent.festivalDayId,
    };

    await fetch(`/api/admin/events/${editingEvent.id || editingEvent._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    refetchEvents();
    toast({ title: "Arena Updated", description: `${newEvent.name} has been updated.` });
    handleCancelEdit();
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
        { title: 'Day 1', date: '2026-04-10', description: 'Opening Ceremony and Technical Events', status: 'Upcoming' },
        { title: 'Day 2', date: '2026-04-11', description: 'Non-Technical Events and Closing Ceremony', status: 'Upcoming' },
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
                      <Image src={decodeHtmlEntities(sponsor.logoUrl || '')} alt={sponsor.name} width={48} height={48} className="max-w-full max-h-full object-contain" />
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
              <CardHeader>
                <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                  {editingEvent ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                  {editingEvent ? 'EDIT ARENA' : 'ADD ARENA'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Name</Label>
                  <Input name="name" value={newEvent.name} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Category</Label>
                  <Select 
                    name="type" 
                    value={newEvent.type} 
                    onValueChange={handleEventTypeChange}
                  >
                    <SelectTrigger className="w-full bg-white/5 border border-white/10 p-2 text-xs rounded-none text-white h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Non-Technical">Non-Technical</SelectItem>
                      <SelectItem value="eSports">eSports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Festival Day</Label>
                   <Select
                      name="festivalDayId"
                      value={newEvent.festivalDayId}
                      onValueChange={handleEventDayChange}
                  >
                      <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto" disabled={festivalDaysLoading}>
                          <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                          {festivalDays && festivalDays.length > 0 ? (
                            festivalDays.map(day => (
                                <SelectItem key={day.id} value={day.id}>{day.name}</SelectItem>
                            ))
                          ) : (
                            <div className="text-muted-foreground text-xs p-4 text-center">
                                Go to the 'Schedule' tab to add days.
                            </div>
                          )}
                      </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest">Start Time</Label>
                    <Input name="startTime" value={newEvent.startTime} onChange={handleNewEventChange} type="datetime-local" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest">Location</Label>
                    <Input name="location" value={newEvent.location} onChange={handleNewEventChange} placeholder="e.g. Main Arena" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Description</Label>
                  <Textarea name="description" value={newEvent.description} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Head</Label>
                  <Input name="eventHead" value={newEvent.eventHead} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest">Event Rules</Label>
                    <div className="flex gap-2">
                        <Input
                            value={currentRule}
                            onChange={(e) => setCurrentRule(e.target.value)}
                            placeholder="Type a rule and click Add"
                            className="bg-white/5 border-white/10 rounded-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddRule();
                                }
                            }}
                        />
                        <Button type="button" onClick={handleAddRule} className="bg-primary hover:bg-primary/80 rounded-none px-4 text-background">
                            Add
                        </Button>
                    </div>
                    <div className="space-y-2 pt-2 max-h-40 overflow-y-auto">
                        {newEvent.rules.length > 0 ? newEvent.rules.map((rule, index) => (
                            <div key={index} className="flex items-center justify-between text-sm glass-panel p-2 border-white/5 bg-white/5 rounded-none">
                                <span className="text-muted-foreground break-all">{rule}</span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteRule(index)}
                                    className="text-muted-foreground hover:text-destructive h-6 w-6 ml-2 flex-shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        )) : (
                            <p className="text-xs text-muted-foreground text-center py-2">No rules added yet.</p>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Registration Fee</Label>
                  <Input name="registrationFee" value={newEvent.registrationFee} onChange={handleNewEventChange} placeholder="e.g., $10 per person" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Organiser Contact (Optional)</Label>
                  <Input name="organiserContact" value={newEvent.organiserContact} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Logo/Image URL</Label>
                  <Input name="imageUrl" value={newEvent.imageUrl} onChange={handleNewEventChange} placeholder="https://..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent} className="w-full bg-primary text-background hover:bg-primary/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                   {editingEvent ? 'UPDATE ARENA' : 'INITIALIZE ARENA'}
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
                      <Image src={member.profileImageUrl} alt={member.fullName} width={40} height={40} className="w-10 h-10 rounded-full object-cover bg-white/10" />
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

    