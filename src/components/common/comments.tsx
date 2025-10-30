"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Field, FieldContent, FieldError, FieldGroup } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ArrowBigLeft, SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const commentSchema = z.object({
  message: z
    .string()
    .nonempty("at least 1 charchter")
    .max(500, "Message is too long"),
});

// Define the comment type
interface Comment {
  id: number;
  comment: string;
  avatar: string;
  daysAgo: number;
  author: string;
}

export function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      message: "",
    },
  });

  const messageValue = form.watch("message");
  const isSubmitDisabled = !messageValue.trim(); // Disable if empty or only whitespace

  function onSubmit(data: z.infer<typeof commentSchema>) {
    toast.success("Comment submitted!");
    form.reset();
  }

  useEffect(() => {
    // Dummy comments data
    const dummyComments: Comment[] = [
      {
        id: 1,
        comment: "This is a great post! Thanks for sharing.",
        avatar: "https://avatar.iran.liara.run/public/1",
        daysAgo: 2,
        author: "john_doe",
      },
      {
        id: 2,
        comment: "I completely agree with your points here.",
        avatar: "https://avatar.iran.liara.run/public/2",
        daysAgo: 1,
        author: "jane_smith",
      },
      {
        id: 3,
        comment: "Could you elaborate more on the second point?",
        avatar: "https://avatar.iran.liara.run/public/3",
        daysAgo: 3,
        author: "alex_wong",
      },
      {
        id: 4,
        comment:
          "Nice insights! Looking forward to more content, tight tight tight tight tight tight tight tight tight tight tight tight tight tight tight tight tight tight tight tight",
        avatar: "https://avatar.iran.liara.run/public/4",
        daysAgo: 5,
        author: "sarah_chen",
      },
      {
        id: 5,
        comment: "I completely agree with your points here.",
        avatar: "https://avatar.iran.liara.run/public/2",
        daysAgo: 1,
        author: "jane_smith",
      },
      {
        id: 6,
        comment: "I completely agree with your points here.",
        avatar: "https://avatar.iran.liara.run/public/2",
        daysAgo: 1,
        author: "jane_smith",
      },
    ];

    setComments(dummyComments);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="flex flex-row w-full gap-1 items-end">
          <Controller
            name="message"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal">
                <FieldContent>
                  <div>
                    <Avatar className="size-10 rounded-lg border flex items-center justify-center bg-black">
                      <AvatarImage
                        src="https://avatar.iran.liara.run/public/15"
                        alt="@evilrabbit"
                      />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                  </div>
                </FieldContent>
                <Textarea
                  {...field}
                  id="message"
                  aria-invalid={fieldState.invalid}
                  placeholder="Leave a comment"
                  required
                />
                {/* {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )} */}
              </Field>
            )}
          />
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className={isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}
          >
            <SendHorizontal />
          </Button>
        </FieldGroup>
      </form>
      <div className="flex flex-col gap-3">
        {/* Comments list */}
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="size-7 rounded-lg border flex items-center justify-center bg-black flex-shrink-0">
              <AvatarImage src={comment.avatar} alt={comment.author} />
              <AvatarFallback>
                {comment.author.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex gap-3 items-baseline">
                <span className="font-light text-sm">{comment.author}</span>
                <span className="text-sm font-extralight text-gray-500">
                  {comment.daysAgo} days ago
                </span>
              </div>
              <p>{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
