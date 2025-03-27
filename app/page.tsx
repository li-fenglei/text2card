import TemplateForm from "@/components/TemplateForm";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">模板图片生成器</h1>
      <TemplateForm />
    </main>
  );
}