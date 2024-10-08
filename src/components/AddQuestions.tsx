import { useEffect, useState } from "react";
import { TailSpin } from 'react-loader-spinner';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Toaster, toast } from 'sonner'
import { ObjectId } from "mongodb";

export default function AddQuestions(){
    const [question, setQuestion] = useState({
        questionTitle: "",
        optionOne: "",
        optionTwo: "",
        optionThree: "",
        optionFour: "",
        answer: "",
    });
    const {isAuthenticated, user} = useKindeBrowserClient();
    const [examName, setExamName] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [institutionCode, setInstituteCode] = useState<string | null>(null);
    const [examDuration, setExamDuration] = useState<string | null>(null);
    const [questionMark, setQuestionMark] = useState<string | null>(null);
    const [negativeMark, setNegativeMark] = useState<string | null>(null);

    const handleAddDone = async () => {
        localStorage.removeItem("examName");
    };

    const handleSubmit = async () => {
        const sendData = {...question, examName: examName, instituteCode: institutionCode, examDuration: examDuration, questionMark: questionMark, negativeMark: negativeMark};
        // console.log(JSON.stringify(question));

        try {
            const res = await fetch('/api/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Metadata': JSON.stringify(sendData)
                }
            });
            const data = await res.json();
            if (data.success) {
                toast.success(`${question.questionTitle} Successfully Saved!`);
                setQuestion({
                    questionTitle: "",
                    optionOne: "",
                    optionTwo: "",
                    optionThree: "",
                    optionFour: "",
                    answer: "optionOne",
                });
            }
            else {
                toast.error("Can't Save!");
            }
        }
        catch (error) {
            console.error("Can't make API Call");
        }
    }

    useEffect (() => {
        // console.log(`Auth: ${isAuthenticated}`);
        if (isAuthenticated) {
            const val = localStorage.getItem('examName');
            if (val === null) {
                setExamName(null)
            }
            else {
                setExamName(val);
            }
            const code = localStorage.getItem('instituteCode');
            if (code === null) {
                setInstituteCode(null)
            }
            else {
                setInstituteCode(code);
            }

            const duration = localStorage.getItem('examDuration');
            if (duration === null) {
                setExamDuration(null)
            }
            else {
                setExamDuration(duration);
            }
            const marks = localStorage.getItem('questionMark');
            if (marks === null) {
                setQuestionMark(null)
            }
            else {
                setQuestionMark(marks);
            }
            const negative = localStorage.getItem('negativeMark');
            if (negative === null) {
                setNegativeMark(null)
            }
            else {
                setNegativeMark(negative);
            }
        }
        setLoading(false);
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className='h-dvh flex items-center justify-center'>
          <TailSpin
              visible={true}
              height="80"
              width="80"
              color="#2A91EB"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
          />
        </div>
        )
    }

    if (examName === null) {
        return <AddExamName/>
    }

    return (
        <div className="flex justify-center">
            <Toaster/>
            <Card className="w-2/5 h-full">
                <CardHeader>
                    <CardTitle>Add Questions</CardTitle>
                    <CardDescription>Add the question and the options here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Question title</Label>
                                <Textarea value={question.questionTitle} onChange={(e) => setQuestion({...question, questionTitle: e.target.value})} placeholder="Enter question title" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Option 1</Label>
                                <Input type="text" value={question.optionOne} onChange={(e) => setQuestion({...question, optionOne: e.target.value})} placeholder="Specify Option 1" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Option 2</Label>
                                <Input type="text" value={question.optionTwo} onChange={(e) => setQuestion({...question, optionTwo: e.target.value})} placeholder="Specify Option 2" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Option 3</Label>
                                <Input type="text" value={question.optionThree} onChange={(e) => setQuestion({...question, optionThree: e.target.value})} placeholder="Specify Option 3" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Option 4</Label>
                                <Input type="text" value={question.optionFour} onChange={(e) => setQuestion({...question, optionFour: e.target.value})} placeholder="Specify Option 4" />
                            </div>
                            {/* <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Answer</Label>
                                <Input type="text" value={question.answer} onChange={(e) => setQuestion({...question, answer: e.target.value})} placeholder="Specify the correct option" />
                            </div> */}
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="framework">Correct Answer</Label>
                                <Select onValueChange={(value) => {setQuestion({...question, answer: value})}}>
                                    <SelectTrigger id="option">
                                        <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent defaultValue={`OptionOne`} position="popper">
                                        <SelectItem value={`optionOne`}>Option 1</SelectItem>
                                        <SelectItem value={`optionTwo`}>Option 2</SelectItem>
                                        <SelectItem value={`optionThree`}>Option 3</SelectItem>
                                        <SelectItem value={`optionFour`}>Option 4</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={() => handleSubmit()}>Save and next</Button>
                    <Button onClick={() => handleAddDone()}>Finish Adding</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export function AddExamName() {
    const [examName, setExamName] = useState<string | null>(null);
    const [examDuration, setExamDuration] = useState<string | null>(null);
    const [questionMark, setQuestionMark] = useState<string | null>(null);
    const [negativeMark, setNegativeMark] = useState<string | null>(null);
    const [hour, setHour] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);

    const handleSubmit = () => {
        localStorage.setItem('examName', `${examName}`);
        
        const duration = (hour * 60) + minute;
        // console.log(`Duration: ${duration}`);
        setExamDuration(`${duration}`);

        localStorage.setItem(`examDuration`, `${duration}`);
        localStorage.setItem(`questionMark`, `${questionMark}`);
        localStorage.setItem(`negativeMark`, `${negativeMark}`);
        toast.success(`${examName} successfully added!`)
    }


    return (
        <>
            <Toaster/>
            <div className="flex justify-center gap-4">
                <div className="flex flex-col w-2/5 space-y-1.5">
                    <Label htmlFor="name">Exam Name</Label>
                    <Input type="text" onChange={(e) => setExamName(e.target.value)} placeholder="Enter exam name" />

                    <Label htmlFor="duration">Exam Duration</Label>
                    <div className="flex gap-2">
                        <Input type="number" required onChange={(e) => setHour(Number(e.target.value))} placeholder="Enter hours" />
                        <Input type="number" onChange={(e) => setMinute(Number(e.target.value))} placeholder="Enter minutes" />
                    </div>
                    <Label htmlFor="name">Per question marks: </Label>
                    <Input type="text" onChange={(e) => setQuestionMark(e.target.value)} placeholder="Enter question marks" />
                    <Label htmlFor="name">Negative marking: </Label>
                    <Input type="text" onChange={(e) => setNegativeMark(e.target.value)} placeholder="Enter negative mark eg. 0.25, 0.5" />
                    <Button onClick={() => handleSubmit()}>Save</Button>
                </div>
            </div>
        </>
    )
}