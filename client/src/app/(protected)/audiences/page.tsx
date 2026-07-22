"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Audience, getAudiences, deleteAudience, } from "@/services/audience.service";

export default function AudiencesPage() {
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAudiences();
  }, []);

  const loadAudiences = async () => {
    try {
      setLoading(true);

      const data = await getAudiences();

      setAudiences(data);
    } catch {
      setError("Failed to load audiences.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this audience?");
    if (!confirmed) { return; }
    
    try {
      await deleteAudience(id);
      await loadAudiences();
    } catch { alert("Failed to delete audience."); }
  };

  if (loading) {
    return <p>Loading audiences...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="wrapper-audiences">
      <div className="head">
         <h2> Audiences </h2>
         <Link href="/audiences/new"> Create Audience</Link>
       </div>  
      <table className="w-full">
        <thead>
            <tr>
            <th>Name</th>
            <th>Filter Field</th>
            <th>Filter Value</th>
            <th>Contact Count</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {audiences.map((audience) => (
            <tr key={audience.id}>
              <td>{audience.name}</td>
              <td> {{ city: "City", company: "Company", tag: "Tag", }[audience.filterField] ?? audience.filterField} </td>
              <td>{audience.filterValue}</td>
              <td>{audience.contactCount}</td>              
              <td>                
                  <Link href={`/audiences/${audience.id}/edit?name=${encodeURIComponent( audience.name)}&filterField=${encodeURIComponent( audience.filterField )}&filterValue=${encodeURIComponent( audience.filterValue )}`} className="edit"> Edit </Link>
                  <button type="button" onClick={() => handleDelete(audience.id)} className="delete"> Delete</button>                
              </td>

            </tr>
          ))}
          {audiences.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4"> No audiences found. </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}