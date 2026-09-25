// @ts-nocheck
"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import supabase from "@/core/lib/supabase";

export function ClosingForm({ closingCase, open, onOpenChange }: any) {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const { data: sites } = useQuery({
    queryKey: ["sites-direct"],
    queryFn: async () => {
      const { data } = await supabase.from("sites").select("id, nom_titre, ville").order("nom_titre");
      return data || [];
    }
  });

  const { data: responsables } = useQuery({
    queryKey: ["responsables-direct"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("id, full_name").order("full_name");
      return data || [];
    }
  });

  const [form, setForm] = useState({
    full_name: "", visit_date: "", site_id: "none", stage: "a_contacter", next_follow_up_at: "", responsable_id: "none"
  });

  useEffect(() => {
    if (open && closingCase) {
      setForm({
        full_name: closingCase.prospect?.full_name || "",
        visit_date: closingCase.visit?.visit_date?.slice(0,10) || "",
        site_id: closingCase.visit?.site_id? String(closingCase.visit.site_id) : "none",
        stage: closingCase.stage || "a_contacter",
        next_follow_up_at: closingCase.next_follow_up_at?.slice(0,16) || "",
        responsable_id: closingCase.assigned_closer_id? String(closingCase.assigned_closer_id) : "none",
      });
    }
  }, [open, closingCase?.id]);

  const save = async () => {
    if (!closingCase) return;
    setSaving(true);
    try {
      console.log("JE SAUVE:", form);

      // 1. Prospect
      const p1 = await supabase.from("prospects").update({ full_name: form.full_name }).eq("id", closingCase.prospect_id);
      if (p1.error) throw new Error("prospects: " + p1.error.message);

      // 2. Visit - SITE
      const p2 = await supabase.from("visits").update({
        visit_date: form.visit_date || null,
        site_id: form.site_id === "none"? null : form.site_id,
      }).eq("id", closingCase.visit_id);
      if (p2.error) throw new Error("visits/site: " + p2.error.message + " -> Mets RLS OFF sur visits 2min");

      // 3. Closing - RESPONSABLE + STAGE
      const p3 = await supabase.from("closing_cases").update({
        stage: form.stage,
        next_follow_up_at: form.next_follow_up_at? new Date(form.next_follow_up_at).toISOString() : null,
        assigned_closer_id: form.responsable_id === "none"? null : form.responsable_id,
      }).eq("id", closingCase.id);
      if (p3.error) throw new Error("closing: " + p3.error.message);

      console.log("OK SAUVE");
      await qc.invalidateQueries({ queryKey: ["closing_cases"] });
      await qc.invalidateQueries({ queryKey: ["closingCases"] });
      await qc.invalidateQueries({ queryKey: ["sites"] });
      onOpenChange(false);

    } catch (e: any) {
      console.error("ERREUR SAVE:", e);
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!closingCase) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[520px] bg-white rounded-2xl p-0 overflow-hidden border-0 shadow-2xl">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-[15px]">Modifier - {closingCase?.prospect?.full_name}</DialogTitle>
            <DialogDescription className="text-xs">{sites?.length || 0} sites, {responsables?.length || 0} responsables chargés</DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 py-5 grid gap-4">
          <div className="space-y-1.5">
            <Label>Nom complet</Label>
            <Input value={form.full_name} onChange={e => setForm(s => ({...s, full_name: e.target.value }))} className="h-11 rounded-xl bg-gray-50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5"><Label>Date visite</Label><Input type="date" value={form.visit_date} onChange={e => setForm(s => ({...s, visit_date: e.target.value }))} className="h-11 rounded-xl bg-gray-50" /></div>
            <div className="space-y-1.5"><Label>Relance</Label><Input type="datetime-local" value={form.next_follow_up_at} onChange={e => setForm(s => ({...s, next_follow_up_at: e.target.value }))} className="h-11 rounded-xl bg-gray-50" /></div>
          </div>

          <div className="space-y-1.5">
            <Label>Site / Programme</Label>
            <select value={form.site_id} onChange={e => setForm(s => ({...s, site_id: e.target.value }))} className="w-full h-11 rounded-xl bg-gray-50 border px-3 text-sm">
              <option value="none">Non renseigné</option>
              {(sites || []).map((s: any) => <option key={s.id} value={s.id}>{s.nom_titre} {s.ville? `- ${s.ville}` : ""}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Étape</Label>
              <select value={form.stage} onChange={e => setForm(s => ({...s, stage: e.target.value }))} className="w-full h-11 rounded-xl bg-gray-50 border px-3 text-sm">
                <option value="a_contacter">À contacter</option><option value="contacte">Contacté</option><option value="interesse">Intéressé</option><option value="negociation">Négociation</option><option value="a_relancer">À relancer</option><option value="gagne">Gagné</option><option value="perdu">Perdu</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Responsable</Label>
              <select value={form.responsable_id} onChange={e => setForm(s => ({...s, responsable_id: e.target.value }))} className="w-full h-11 rounded-xl bg-gray-50 border px-3 text-sm">
                <option value="none">Non assigné</option>
                {(responsables || []).map((r: any) => <option key={r.id} value={r.id}>{r.full_name}</option>)}
              </select>
            </div>
          </div>

          <Button disabled={saving} onClick={save} className="h-12 rounded-xl bg-[#0F5D2F] text-white w-full mt-2">
            {saving? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}