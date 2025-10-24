import { useState } from "react";
import { Plus, FileText, Link as LinkIcon, Upload, Search, Trash2, ExternalLink, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/info-tooltip";

export interface KnowledgeEntry {
  id: string;
  category: string;
  type: "text" | "link" | "document";
  title: string;
  content: string;
  url?: string;
  fileName?: string;
  createdAt: string;
}

interface KnowledgeBaseProps {
  entries: KnowledgeEntry[];
  onAdd: (entry: Omit<KnowledgeEntry, "id" | "createdAt">) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES = [
  { id: "customers", label: "Customers & Suppliers", icon: "👥" },
  { id: "coa", label: "Chart of Accounts", icon: "📊" },
  { id: "products", label: "Products & Services", icon: "🏷️" },
  { id: "tax", label: "Tax Configuration", icon: "💰" },
  { id: "banking", label: "Payment & Banking", icon: "🏦" },
  { id: "policies", label: "Accounting Policies", icon: "📋" },
  { id: "payroll", label: "Payroll & Staff", icon: "👔" },
  { id: "contracts", label: "Contracts", icon: "📄" },
  { id: "other", label: "Other", icon: "📁" },
];

export const KnowledgeBase = ({ entries, onAdd, onDelete }: KnowledgeBaseProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["customers"]));
  
  // Add form state
  const [addType, setAddType] = useState<"text" | "link" | "document">("text");
  const [addCategory, setAddCategory] = useState("customers");
  const [addTitle, setAddTitle] = useState("");
  const [addContent, setAddContent] = useState("");
  const [addUrl, setAddUrl] = useState("");

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === "" || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const entriesByCategory = CATEGORIES.map(cat => ({
    ...cat,
    entries: filteredEntries.filter(e => e.category === cat.id),
  }));

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onAdd({
          category: addCategory,
          type: "document",
          title: addTitle || file.name,
          content: content.substring(0, 10000), // Limit size
          fileName: file.name,
        });
        toast.success("Document uploaded");
        setAddDialogOpen(false);
        resetForm();
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = () => {
    if (!addTitle) {
      toast.error("Please enter a title");
      return;
    }

    if (addType === "text" && !addContent) {
      toast.error("Please enter content");
      return;
    }

    if (addType === "link" && !addUrl) {
      toast.error("Please enter a URL");
      return;
    }

    onAdd({
      category: addCategory,
      type: addType,
      title: addTitle,
      content: addType === "text" ? addContent : addUrl,
      url: addType === "link" ? addUrl : undefined,
    });

    toast.success("Knowledge entry added");
    setAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAddTitle("");
    setAddContent("");
    setAddUrl("");
    setAddType("text");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text": return <FileText className="h-4 w-4" />;
      case "link": return <LinkIcon className="h-4 w-4" />;
      case "document": return <Upload className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader 
          title="Knowledge Base"
          description="Store business context and master data for AI-powered processing. Include customer/supplier lists, chart of accounts mappings, product catalogs, tax configurations, payment methods, accounting policies, payroll info, contracts, and other business knowledge."
        />

        {/* Demo Info Banner */}
        {entries.length > 0 && entries.some(e => e.title.includes('TechConsult')) && (
          <div className="mb-6 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <h3 className="font-mono font-semibold text-sm">📚 Knowledge Base Loaded</h3>
                <p className="text-xs font-mono text-muted-foreground">
                  The demo has loaded <strong>{entries.length} comprehensive entries</strong> that provide business context to the AI assistant. This includes:
                </p>
                <ul className="text-xs font-mono text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Company information and business overview</li>
                  <li>Chart of accounts documentation and usage guidelines</li>
                  <li>Revenue recognition policies and procedures</li>
                  <li>Employee roster and payroll information</li>
                  <li>Client contract details and billing arrangements</li>
                  <li>Operational guidelines and accounting standards</li>
                </ul>
                <p className="text-xs font-mono text-primary/80 mt-2">
                  💡 The AI assistant uses this knowledge to provide accurate, context-aware responses about your business operations.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex gap-4 mb-6 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded font-mono text-xs"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48 rounded font-mono text-xs bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-[200]">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.id} value={cat.id} className="font-mono text-xs">
                  {cat.icon} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2 rounded font-mono text-xs">
                <Plus className="h-4 w-4" />
                Add Knowledge
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-mono">Add Knowledge Entry</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-semibold mb-2 block">Category</label>
                  <Select value={addCategory} onValueChange={setAddCategory}>
                    <SelectTrigger className="rounded font-mono text-xs bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border z-[200]">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="font-mono text-xs">
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Tabs value={addType} onValueChange={(v) => setAddType(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="text" className="font-mono text-xs">
                      <FileText className="h-3 w-3 mr-2" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger value="link" className="font-mono text-xs">
                      <LinkIcon className="h-3 w-3 mr-2" />
                      Link
                    </TabsTrigger>
                    <TabsTrigger value="document" className="font-mono text-xs">
                      <Upload className="h-3 w-3 mr-2" />
                      Document
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <label className="text-xs font-mono font-semibold mb-2 block">Title</label>
                      <Input
                        placeholder="e.g., Customer Master List"
                        value={addTitle}
                        onChange={(e) => setAddTitle(e.target.value)}
                        className="rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-semibold mb-2 block">Content</label>
                      <Textarea
                        placeholder="Enter knowledge content..."
                        value={addContent}
                        onChange={(e) => setAddContent(e.target.value)}
                        rows={8}
                        className="rounded font-mono text-xs"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="link" className="space-y-4">
                    <div>
                      <label className="text-xs font-mono font-semibold mb-2 block">Title</label>
                      <Input
                        placeholder="e.g., Tax Rate Guide"
                        value={addTitle}
                        onChange={(e) => setAddTitle(e.target.value)}
                        className="rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-semibold mb-2 block">URL</label>
                      <Input
                        placeholder="https://..."
                        value={addUrl}
                        onChange={(e) => setAddUrl(e.target.value)}
                        className="rounded font-mono text-xs"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="document" className="space-y-4">
                    <div>
                      <label className="text-xs font-mono font-semibold mb-2 block">Title (Optional)</label>
                      <Input
                        placeholder="Leave blank to use filename"
                        value={addTitle}
                        onChange={(e) => setAddTitle(e.target.value)}
                        className="rounded font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-semibold mb-2 block">Upload File</label>
                      <Input
                        type="file"
                        accept=".txt,.csv,.json,.md"
                        onChange={handleFileUpload}
                        className="rounded font-mono text-xs"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        Supported: TXT, CSV, JSON, MD
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {addType !== "document" && (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="rounded font-mono text-xs">
                      Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="rounded font-mono text-xs">
                      Add Entry
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-muted border border-border rounded p-4">
            <div className="text-2xl font-mono font-bold">{entries.length}</div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Total Entries</div>
          </div>
          <div className="bg-muted border border-border rounded p-4">
            <div className="text-2xl font-mono font-bold">
              {CATEGORIES.filter(cat => entries.some(e => e.category === cat.id)).length}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Categories Used</div>
          </div>
          <div className="bg-muted border border-border rounded p-4">
            <div className="text-2xl font-mono font-bold">
              {entries.filter(e => e.type === "document").length}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">Documents</div>
          </div>
          <div className="bg-muted border border-border rounded p-4">
            <div className="text-2xl font-mono font-bold">
              {entries.filter(e => e.type === "link").length}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">External Links</div>
          </div>
        </div>

        {/* Knowledge Entries by Category */}
        {entriesByCategory.length === 0 ? (
          <div className="border border-border rounded p-12 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-mono text-muted-foreground">
              No knowledge entries yet. Click "Add Knowledge" to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entriesByCategory.map(category => {
              if (category.entries.length === 0 && selectedCategory === "all") return null;
              
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div key={category.id} className="border border-border rounded overflow-hidden">
                  {/* Category Header */}
                  <div
                    onClick={() => toggleCategory(category.id)}
                    className="bg-muted p-4 flex items-center justify-between cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      <span className="text-2xl">{category.icon}</span>
                      <h3 className="font-mono font-semibold text-sm">{category.label}</h3>
                    </div>
                    <div className="bg-background border border-border rounded-full px-3 py-1 text-xs font-mono font-semibold">
                      {category.entries.length}
                    </div>
                  </div>

                  {/* Category Entries */}
                  {isExpanded && category.entries.length > 0 && (
                    <div className="divide-y divide-border">
                      {category.entries.map(entry => (
                        <div key={entry.id} className="p-4 hover:bg-gridHover transition-colors flex items-start gap-4">
                          <div className="p-2 bg-muted rounded">
                            {getTypeIcon(entry.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-mono font-semibold text-sm mb-1">{entry.title}</h4>
                                {entry.type === "link" ? (
                                  <a
                                    href={entry.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-mono text-primary hover:underline flex items-center gap-1"
                                  >
                                    {entry.url}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                ) : (
                                  <p className="text-xs font-mono text-muted-foreground line-clamp-2">
                                    {entry.content.substring(0, 200)}
                                    {entry.content.length > 200 && "..."}
                                  </p>
                                )}
                                {entry.fileName && (
                                  <p className="text-[10px] font-mono text-muted-foreground mt-1">
                                    📎 {entry.fileName}
                                  </p>
                                )}
                              </div>
                              <Button
                                onClick={() => onDelete(entry.id)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground flex-shrink-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-[10px] font-mono text-muted-foreground mt-2">
                              Added {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
