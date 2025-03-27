"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import TemplatePreview from "@/components/TemplatePreview";

export default function TemplateForm() {
    const [formData, setFormData] = useState({
        title: "做个垃圾然后发出去!",
        content: "小宇宙注册了两年、话筒买了一年，一个音频都没发出去...\n\n今天终于把昨天的录音当作第一份小宇宙发了。\n\n以前一直在想，我要先去学习剪辑，再去找一些好听的音频，开场白一定要打动人，背景音乐的过度一定要自然，普通话应该要清晰....\n\n这些都是不去做的借口罢了",
        footer: "搬砖写作、烟火日常",
        subfooter: "扫码加我微信好友",
        avatarUrl: "/avatar.png",
        qrType: "qrcode" as "qrcode" | "image",
        qrValue: "https://example.com",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (value: "qrcode" | "image") => {
        setFormData((prev) => ({ ...prev, qrType: value }));
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
            <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">模板内容</h2>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">标题</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="content">内容</Label>
                        <Textarea
                            id="content"
                            name="content"
                            rows={10}
                            value={formData.content}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="footer">底部文字</Label>
                        <Input
                            id="footer"
                            name="footer"
                            value={formData.footer}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="subfooter">二维码旁文字</Label>
                        <Input
                            id="subfooter"
                            name="subfooter"
                            value={formData.subfooter}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="avatarUrl">头像URL</Label>
                        <Input
                            id="avatarUrl"
                            name="avatarUrl"
                            value={formData.avatarUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>二维码类型</Label>
                        <RadioGroup 
                            value={formData.qrType} 
                            onValueChange={handleRadioChange}
                            className="flex space-x-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="qrcode" id="qrcode" />
                                <Label htmlFor="qrcode">生成二维码</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="image" id="image" />
                                <Label htmlFor="image">图片链接</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div>
                        <Label htmlFor="qrValue">
                            {formData.qrType === "qrcode" ? "二维码链接" : "二维码图片URL"}
                        </Label>
                        <Input
                            id="qrValue"
                            name="qrValue"
                            value={formData.qrValue}
                            onChange={handleChange}
                            placeholder={formData.qrType === "qrcode" 
                                ? "输入要生成二维码的链接" 
                                : "输入二维码图片的URL"}
                        />
                    </div>
                </div>
            </Card>

            <TemplatePreview formData={formData} />
        </div>
    );
}