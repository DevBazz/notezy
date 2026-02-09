import { Trash2, Share2 } from "lucide-react";
import { Button  } from "./ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "./ui/card";

type Note = {
    id: string;
    title: string;
    content: string;
    icon?: string;
    color?: string;
}

const NoteCard = ({ note  }: { note: Note}) => {
  return (
    <Card>
        <CardHeader>
            <CardTitle>{note.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p>{note.content}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
            </Button>
        </CardFooter>
    </Card>
  )
}

export default NoteCard