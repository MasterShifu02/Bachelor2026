import { useEffect, useRef, useState } from "react"
import { getCaseComments, addCaseComment } from "../../services/caseService"
import { supabase } from "../../lib/supabase/client"
import type { Database } from "../../types/database.types"
import "./CaseComments.css"

type Props = {
  caseId: string
}

type CommentWithProfile =
  Database["public"]["Tables"]["case_comments"]["Row"] & {
    profiles: {
      name: string
      role: string
    } | null
  }

export function CaseComments({ caseId }: Props) {
  const [comments, setComments] = useState<CommentWithProfile[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  // ------------------------------
  // HENT INNLOGGET BRUKER
  // ------------------------------
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  // ------------------------------
  // INITIAL LOAD
  // ------------------------------
  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await getCaseComments(caseId)
        setComments(data ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [caseId])

  // ------------------------------
  // REALTIME
  // ------------------------------
  useEffect(() => {
    const channel = supabase
      .channel(`case-comments-${caseId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "case_comments",
          filter: `case_id=eq.${caseId}`,
        },
        async () => {
          const data = await getCaseComments(caseId)
          setComments(data ?? [])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [caseId])

  // ------------------------------
  // AUTO SCROLL
  // ------------------------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [comments])

  // ------------------------------
  // ADD COMMENT
  // ------------------------------
  async function handleAddComment() {
    if (!newComment.trim()) return

    try {
      await addCaseComment(caseId, newComment)
      setNewComment("")
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p>Laster kommentarer...</p>

  return (
    <div className="case-comments">
      <h2>Kommentarer</h2>

      {/* ------------------------------ */}
      {/* COMMENT LIST */}
      {/* ------------------------------ */}
      <div className="comments-container">
        {comments.length === 0 && <p>Ingen kommentarer enda</p>}

        {comments.map((c) => {
          const isMe = c.author_id === userId

          return (
            <div
              key={c.id}
              className={`comment-row ${isMe ? "me" : "other"}`}
            >
              <div className="comment-bubble">
                <div className="comment-header">
                  <strong>{c.profiles?.name ?? "Ukjent"}</strong>{" "}
                  <span>({c.profiles?.role})</span>
                </div>

                <p>{c.comment}</p>

                <small className="comment-timestamp">
                  {c.created_at
                    ? new Date(c.created_at).toLocaleString()
                    : ""}
                </small>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* ------------------------------ */}
      {/* INPUT */}
      {/* ------------------------------ */}
      <div className="comment-input">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Skriv en kommentar..."
          rows={1}
          onInput={(e) => {
            const el = e.currentTarget
            el.style.height = "auto"
            el.style.height = el.scrollHeight + "px"
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              handleAddComment()
            }
          }}
        />

        <button
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Send
        </button>
      </div>
    </div>
  )
}