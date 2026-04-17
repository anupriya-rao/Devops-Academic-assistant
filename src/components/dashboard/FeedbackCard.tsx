import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export const FeedbackCard = () => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;

    console.log("Feedback submitted:", text); // later connect to backend
    setText("");
  };

  return (
    <article className="mt-6 rounded-3xl bg-card border border-border p-6 shadow-card animate-fade-in-up">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-2xl bg-primary-soft grid place-items-center">
          <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-foreground">
            Feedback / Comments
          </h2>
          <p className="text-xs text-muted-foreground">
            Share your thoughts with your professor
          </p>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your feedback here..."
        className="w-full min-h-[100px] rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth resize-none"
      />

      {/* Button */}
      <button
        onClick={handleSubmit}
        className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-smooth"
      >
        <Send className="h-4 w-4" />
        Submit Feedback
      </button>
    </article>
  );
};