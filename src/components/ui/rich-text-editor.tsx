"use client";

import { useCallback, useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  List, 
  ListOrdered, 
  Link,
  Palette,
  Type,
  Strikethrough,
  Subscript,
  Superscript,
  Quote,
  Code,
  Undo,
  Redo
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const COLORS = [
  "#000000", "#333333", "#666666", "#999999", "#CCCCCC", "#FFFFFF",
  "#FF0000", "#FF6666", "#FFCCCC", "#00FF00", "#66FF66", "#CCFFCC",
  "#0000FF", "#6666FF", "#CCCCFF", "#FFFF00", "#FFFF66", "#FFFFCC",
  "#FF00FF", "#FF66FF", "#FFCCFF", "#00FFFF", "#66FFFF", "#CCFFFF",
  "#FFA500", "#FFCC66", "#FFE5CC", "#800080", "#CC66CC", "#E5CCE5"
];

const FONT_SIZES = [
  { value: "1", label: "8pt" },
  { value: "2", label: "10pt" },
  { value: "3", label: "12pt" },
  { value: "4", label: "14pt" },
  { value: "5", label: "18pt" },
  { value: "6", label: "24pt" },
  { value: "7", label: "36pt" }
];

const FONT_FAMILIES = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Georgia", label: "Georgia" },
  { value: "Verdana", label: "Verdana" },
  { value: "Courier New", label: "Courier New" },
  { value: "Tahoma", label: "Tahoma" },
  { value: "Impact", label: "Impact" }
];

export interface RichTextEditorRef {
  focus: () => void;
  getContent: () => string;
  setContent: (content: string) => void;
}

export const RichTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>(
  ({ value = "", onChange, placeholder = "Enter description...", className, disabled = false }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const [isBackgroundColorPickerOpen, setIsBackgroundColorPickerOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => {
        editorRef.current?.focus();
      },
      getContent: () => {
        return editorRef.current?.innerHTML || "";
      },
      setContent: (content: string) => {
        if (editorRef.current) {
          editorRef.current.innerHTML = content;
        }
      }
    }));

    useEffect(() => {
      if (editorRef.current && value !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = value;
      }
    }, [value]);

    const executeCommand = useCallback((command: string, value?: string) => {
      if (disabled) return;
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      
      // Trigger onChange
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, [disabled, onChange]);

    const handleInput = useCallback(() => {
      if (onChange && editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, [onChange]);

    const insertLink = useCallback(() => {
      const url = prompt("Enter URL:");
      if (url) {
        executeCommand("createLink", url);
      }
    }, [executeCommand]);

    const changeFontSize = useCallback((size: string) => {
      executeCommand("fontSize", size);
    }, [executeCommand]);

    const changeFontFamily = useCallback((family: string) => {
      executeCommand("fontName", family);
    }, [executeCommand]);

    const changeColor = useCallback((color: string) => {
      executeCommand("foreColor", color);
      setIsColorPickerOpen(false);
    }, [executeCommand]);

    const changeBackgroundColor = useCallback((color: string) => {
      executeCommand("backColor", color);
      setIsBackgroundColorPickerOpen(false);
    }, [executeCommand]);

    const isCommandActive = useCallback((command: string) => {
      try {
        return document.queryCommandState(command);
      } catch {
        return false;
      }
    }, []);

    return (
      <div className={cn("border rounded-lg overflow-hidden bg-background", className)}>
        {/* Toolbar */}
        <div className="border-b p-2 flex flex-wrap items-center gap-1 bg-muted/50">
          {/* Undo/Redo */}
          <Toggle
            pressed={false}
            onPressedChange={() => executeCommand("undo")}
            disabled={disabled}
            size="sm"
          >
            <Undo className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={false}
            onPressedChange={() => executeCommand("redo")}
            disabled={disabled}
            size="sm"
          >
            <Redo className="h-4 w-4" />
          </Toggle>
          
          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Font Family */}
          <Select onValueChange={changeFontFamily} disabled={disabled}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Font Size */}
          <Select onValueChange={changeFontSize} disabled={disabled}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Text Formatting */}
          <Toggle
            pressed={isCommandActive("bold")}
            onPressedChange={() => executeCommand("bold")}
            disabled={disabled}
            size="sm"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isCommandActive("italic")}
            onPressedChange={() => executeCommand("italic")}
            disabled={disabled}
            size="sm"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isCommandActive("underline")}
            onPressedChange={() => executeCommand("underline")}
            disabled={disabled}
            size="sm"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isCommandActive("strikeThrough")}
            onPressedChange={() => executeCommand("strikeThrough")}
            disabled={disabled}
            size="sm"
          >
            <Strikethrough className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Text Color */}
          <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" disabled={disabled}>
                <Type className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-6 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => changeColor(color)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Background Color */}
          <Popover open={isBackgroundColorPickerOpen} onOpenChange={setIsBackgroundColorPickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" disabled={disabled}>
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="grid grid-cols-6 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => changeBackgroundColor(color)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Alignment */}
          <Toggle
            pressed={isCommandActive("justifyLeft")}
            onPressedChange={() => executeCommand("justifyLeft")}
            disabled={disabled}
            size="sm"
          >
            <AlignLeft className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isCommandActive("justifyCenter")}
            onPressedChange={() => executeCommand("justifyCenter")}
            disabled={disabled}
            size="sm"
          >
            <AlignCenter className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isCommandActive("justifyRight")}
            onPressedChange={() => executeCommand("justifyRight")}
            disabled={disabled}
            size="sm"
          >
            <AlignRight className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isCommandActive("justifyFull")}
            onPressedChange={() => executeCommand("justifyFull")}
            disabled={disabled}
            size="sm"
          >
            <AlignJustify className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Lists */}
          <Toggle
            pressed={isCommandActive("insertUnorderedList")}
            onPressedChange={() => executeCommand("insertUnorderedList")}
            disabled={disabled}
            size="sm"
          >
            <List className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isCommandActive("insertOrderedList")}
            onPressedChange={() => executeCommand("insertOrderedList")}
            disabled={disabled}
            size="sm"
          >
            <ListOrdered className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Other Formatting */}
          <Toggle
            pressed={isCommandActive("insertBlockquote")}
            onPressedChange={() => executeCommand("formatBlock", "blockquote")}
            disabled={disabled}
            size="sm"
          >
            <Quote className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={false}
            onPressedChange={() => executeCommand("formatBlock", "pre")}
            disabled={disabled}
            size="sm"
          >
            <Code className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={false}
            onPressedChange={insertLink}
            disabled={disabled}
            size="sm"
          >
            <Link className="h-4 w-4" />
          </Toggle>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Subscript/Superscript */}
          <Toggle
            pressed={isCommandActive("subscript")}
            onPressedChange={() => executeCommand("subscript")}
            disabled={disabled}
            size="sm"
          >
            <Subscript className="h-4 w-4" />
          </Toggle>
          <Toggle
            pressed={isCommandActive("superscript")}
            onPressedChange={() => executeCommand("superscript")}
            disabled={disabled}
            size="sm"
          >
            <Superscript className="h-4 w-4" />
          </Toggle>
        </div>

        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          className={cn(
            "min-h-32 p-4 focus:outline-none prose prose-sm max-w-none",
            disabled && "opacity-50 cursor-not-allowed",
            "empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:pointer-events-none"
          )}
          onInput={handleInput}
          data-placeholder={placeholder}
          style={{
            minHeight: "128px"
          }}
          suppressContentEditableWarning={true}
        />
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";