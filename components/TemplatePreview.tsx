"use client";

import { useRef, useEffect, useState } from "react";
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
        qrCodeValue: string;
        imageValue: string;
    };
}

export default function TemplatePreview({ formData }: TemplatePreviewProps) {
    const templateRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    
    // 检测设备类型
    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        
        return () => {
            window.removeEventListener('resize', checkIfMobile);
        };
    }, []);

    const handleExport = async (scale: number = 1) => {
        if (!templateRef.current) return;

        try {
            // 创建一个临时的canvas元素
            const tempCanvas = document.createElement('canvas');
            const ctx = tempCanvas.getContext('2d');
            
            // 先用html2canvas渲染原始尺寸
            const originalCanvas = await html2canvas(templateRef.current, {
                scale: 2, // 使用2倍缩放以获得更清晰的图像
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false
            });
            
            // 根据缩放比例设置临时canvas的尺寸
            tempCanvas.width = originalCanvas.width * scale;
            tempCanvas.height = originalCanvas.height * scale;
            
            // 在临时canvas上绘制缩放后的图像
            if (ctx) {
                ctx.drawImage(
                    originalCanvas, 
                    0, 0, originalCanvas.width, originalCanvas.height,
                    0, 0, tempCanvas.width, tempCanvas.height
                );
            }
            
            // 从临时canvas获取图像数据
            const image = tempCanvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;
            link.download = `template${scale !== 1 ? `_${scale}x` : ""}.png`;
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

                {isMobile ? (
                    // 手机端样式
                    <div
                        ref={templateRef}
                        className="w-full rounded-xl overflow-hidden"
                        style={{
                            backgroundColor: "#F5F5F5",
                            // backgroundColor: "#F5FFFA",
                            padding: "1rem",
                            maxWidth: "100%"
                        }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-400">
                                <img
                                    src={formData.avatarUrl}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className="text-gray-700 text-sm">{currentDate}</span>
                        </div>

                        <h1 className="font-medium mt-3 mb-4" style={{ fontSize: '1rem', lineHeight: '1.4' }}>
                            {formData.title}
                        </h1>
                        
                        <div className="space-y-3 text-gray-800 text-sm">
                            {contentParagraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>

                        <div className="flex justify-end mt-3">
                            <span className="text-xs text-gray-600">字数:{wordCount}</span>
                        </div>

                        <div className="mt-6 pt-3 border-t border-gray-300">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <div className="text-gray-700 font-medium">{formData.footer}</div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        {formData.subfooter}
                                    </div>
                                </div>
                                {(formData.qrType === 'qrcode' && formData.qrCodeValue) ? (
                                    <QRCodeSVG
                                        value={formData.qrCodeValue}
                                        size={64}
                                        fgColor="#4b5563"
                                    />
                                ) : (formData.qrType === 'image' && formData.imageValue) ? (
                                    <img
                                        src={formData.imageValue}
                                        alt="二维码图片"
                                        width={64}
                                        height={64}
                                        className="rounded-md"
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                ) : (
                    // PC端样式
                    <div
                        ref={templateRef}
                        className="w-full max-w-sm mx-auto rounded-xl overflow-hidden"
                        style={{
                            background: "linear-gradient(to bottom, #a7f3d0, #bae6fd)",
                            padding: "1.5rem",
                            maxWidth: "100%",
                            width: "360px",
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

                            <h1 className="font-medium mt-4 mb-6" 
                                style={{ 
                                    fontSize: '1rem',
                                    lineHeight: '1.4'
                                }}
                            >
                                {formData.title}
                            </h1>
                            <div className="space-y-4 text-gray-900 text-sm" style={{ fontFamily: "'宋体', SimSun, '新宋体', NSimSun, serif" }}>
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
                                        <div className="text-gray-500 font-bold">{formData.footer}</div>
                                        <div className="text-xs text-gray-500 font-light mt-1">
                                            {formData.subfooter}
                                        </div>
                                    </div>
                                    {(formData.qrType === 'qrcode' && formData.qrCodeValue) ? (
                                        <QRCodeSVG
                                            value={formData.qrCodeValue}
                                            size={64}
                                            fgColor="#6b7280"
                                        />
                                    ) : (formData.qrType === 'image' && formData.imageValue) ? (
                                        <img
                                            src={formData.imageValue}
                                            alt="二维码图片"
                                            width={64}
                                            height={64}
                                            className="rounded-md"
                                            style={{ filter: 'grayscale(100%) opacity(80%)' }}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap gap-4 mt-4">
                    <Button
                        onClick={() => handleExport(0.5)}
                        className="flex-1 min-w-[120px]"
                    >
                        导出 0.5x 图片
                    </Button>
                    <Button
                        onClick={() => handleExport(1)}
                        className="flex-1 min-w-[120px]"
                    >
                        导出 1x 图片
                    </Button>
                </div>
            </Card>
        </div>
    );
}