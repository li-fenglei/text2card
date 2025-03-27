"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import html2canvas from "html2canvas-pro";
import { QRCodeSVG } from "qrcode.react";

interface TemplatePreviewProps {
    formData: {
        title: string;
        content: string;
        footer: string;
        subfooter: string;
        avatarUrl: string;
        qrType: 'qrcode' | 'image';
        qrValue: string;
    };
}

export default function TemplatePreview({ formData }: TemplatePreviewProps) {
    const templateRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        if (!templateRef.current) return;

        try {
            // 创建一个克隆元素以避免修改原始DOM
            const clone = templateRef.current.cloneNode(true) as HTMLElement;
            document.body.appendChild(clone);

            // 设置克隆元素的样式，使其不可见但仍可渲染
            clone.style.position = 'absolute';
            clone.style.left = '-9999px';
            clone.style.top = '-9999px';

            // 明确设置背景色为标准RGB格式
            clone.style.background = "linear-gradient(to bottom, #a7f3d0, #bae6fd)";

            // 将所有样式转换为内联样式，避免oklch颜色
            const convertStyles = (element: HTMLElement) => {
                const style = window.getComputedStyle(element);

                // 设置基本样式
                element.style.color = style.color.includes('oklch') ? '#1f2937' : style.color;
                element.style.backgroundColor = style.backgroundColor.includes('oklch') ? 'transparent' : style.backgroundColor;
                element.style.borderColor = style.borderColor.includes('oklch') ? '#e5e7eb' : style.borderColor;
                element.style.borderWidth = style.borderWidth;
                element.style.borderStyle = style.borderStyle;
                element.style.borderRadius = style.borderRadius;
                element.style.padding = style.padding;
                element.style.margin = style.margin;
                element.style.fontFamily = style.fontFamily;
                element.style.fontSize = style.fontSize;
                element.style.fontWeight = style.fontWeight;
                element.style.textAlign = style.textAlign;

                // 处理子元素
                Array.from(element.children).forEach(child => {
                    if (child instanceof HTMLElement) {
                        convertStyles(child);
                    }
                });
            };

            // 应用样式转换
            convertStyles(clone);

            // 使用html2canvas-pro
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null
            });

            // 移除克隆元素
            document.body.removeChild(clone);

            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = "template.png";
            link.click();
        } catch (error) {
            console.error("导出图片时:", error);
            alert("导出图片失败，请稍后再试");
        }
    };

    const currentDate = format(
        new Date(),
        "yyyy年M月d日 a h点mm分",
        { locale: zhCN }
    ).replace("上午", "上午").replace("下午", "下午");

    const contentParagraphs = formData.content.split("\n\n").filter(Boolean);
    const wordCount = formData.content.replace(/\s/g, "").length;

    return (
        <div className="flex flex-col gap-4">
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">预览</h2>

                <div
                    ref={templateRef}
                    className="w-full max-w-sm mx-auto rounded-xl overflow-hidden"
                    style={{
                        background: "linear-gradient(to bottom, #a7f3d0, #bae6fd)",
                        padding: "1.5rem",
                    }}
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-1">
                                <img
                                    src={formData.avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <span className="text-gray-500 text-sm font-light">{currentDate}</span>
                        </div>

                        <h1 className="text-2xl font-medium mt-4 mb-6">{formData.title}</h1>

                        <div className="space-y-4 text-gray-900" style={{ fontFamily: "'宋体', SimSun, '新宋体', NSimSun, serif" }}>
                            {contentParagraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>

                        <div className="flex justify-end mt-4">
                            <span className="text-xs text-gray-500 font-light">字数:{wordCount}</span>
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <div className="text-gray-600 font-bold">{formData.footer}</div>
                                    <div className="text-xs text-gray-500 font-light mt-0.5">
                                        {formData.subfooter}
                                    </div>
                                </div>
                                {formData.qrValue && (
                                    formData.qrType === 'qrcode' ? (
                                        <QRCodeSVG value={formData.qrValue} size={64} />
                                    ) : (
                                        <img 
                                            src={formData.qrValue} 
                                            alt="二维码图片" 
                                            width={64} 
                                            height={64} 
                                            className="rounded-md"
                                        />
                                    )
                                )}
                                
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleExport}
                    className="w-full mt-4"
                >
                    导出图片
                </Button>
            </Card>
        </div>
    );
}