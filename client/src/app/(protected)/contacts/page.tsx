"use client";

import { importContacts, Contact, getContacts, deleteContact } from "@/services/contact.service";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function ContactsPage() {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] =  useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const limit = 10;
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total:0,
        totalPages: 1,
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
    setPage(1);
    }, [debouncedSearch]);

    useEffect(() => {       
        fetchContacts();
    }, [debouncedSearch, page, limit]);
    
    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await getContacts({
                search: debouncedSearch,
                page, 
                limit,
            });
            // console.log(response);
            setContacts(response.data.contacts);
            setPagination(response.data.pagination);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to load contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async ( id: string) => {
        const confirmed = window.confirm( "Are you sure you want to delete this contact?" );
        if (!confirmed) { return; }
        try {
            await deleteContact(id);
            fetchContacts();
        } catch (error) {
            console.error(error);
            alert("Failed to delete contact");
        }
    };

    const handleImport = async () => {

        if (!selectedFile) { return; }        
        try {
            console.log("Calling API...");
            const result = await importContacts(selectedFile);
            // alert(result.message);
            alert(`${result.data.added} contact(s) added.\n${result.data.skipped} duplicate(s) skipped.` );            
            setSelectedFile(null);
            if (fileInputRef.current) { fileInputRef.current.value = ""; }
            await fetchContacts();
        } catch (error) {
            console.error(error);
            alert("Import failed");
        }
};

    // if (loading) { return <p>Loading contacts...</p>; }That means the component is re-rendering in a way that causes the <input> element to be recreated, so it loses focus after every API call.
    // if (error) { return <p>{error}</p>; } If your page has something like: then every time you type:Instead, the page should always render the input, and only show a loading message near the table.The input never disappears now, so typing will be smooth.

    return (
        <>
            <div className="wrapper-contacts">
                <div className="head">
                    <h2> Contacts </h2>
                    <Link href="/contacts/new">New Contact</Link>
                </div>
                
                <input ref={fileInputRef} type="file" accept=".csv" onChange={(e) => { const file = e.target.files?.[0];
                 if (file) { setSelectedFile(file); } }} />
                <button onClick={handleImport} disabled={!selectedFile} className="bg-green-600 text-white px-4 py-2 rounded ml-2 cursor-pointer import"> Import CSV</button>     
                
                <input type="text" placeholder="Search by name, email or phone" value={search} onChange={(e) => setSearch(e.target.value)} className="rounded w-full" />
                {error && (<p className="text-red-500"> {error} </p>)}
                { !loading && contacts.length === 0 ? (<p>No contacts found.</p>)
                : ( <table border={1} cellPadding={10}>
                    <thead>
                        <tr>
                            <th className="col-md">Name</th>
                            <th>Email</th>
                            <th className="col-md">Phone</th>
                            <th>City</th>
                            <th>Company</th>
                            <th className="col-xsmall">Tag</th>
                            <th className="col-small">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <tr key={contact.id}>
                                <td>{contact.name}</td>
                                <td>{contact.email}</td>
                                <td>{contact.phone || "-"}</td>
                                <td>{contact.customFields?.city ?? "-"}</td>
                                <td>{contact.customFields?.company ?? "-"}</td>
                                <td>{contact.customFields?.tag ?? "-"}</td>
                                <td>
                                    <Link href={`/contacts/${contact.id}`} className="edit">Edit</Link>
                                    <button onClick={() => handleDelete(contact.id)} className="delete"> Delete </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}
                <div className="pagination">
                    <button onClick={() => setPage((prev) => prev - 1)} disabled={page === 1} className="border rounded px-4 py-2 disabled:opacity-50"> Previous</button>
                    <span> Page {pagination.page} of {pagination.totalPages} </span>
                    <button onClick={() => setPage((prev) => prev + 1)} disabled={page >= pagination.totalPages} className="border rounded px-4 py-2 disabled:opacity-50">Next</button>
                </div>
            </div>
        </>
    );
}
