export default function WelcomeMessage() {
  return (
    <div className="flex flex-col items-center justify-center h-full mt-10">
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-inset ring-gray-200 px-6 py-5 max-w-lg w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Welcome to the Islamic Scholar Chatbot! 🕌
        </h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          I can assist you with:
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Understanding Quranic verses and their interpretations</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Learning about Hadith and Islamic teachings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Finding answers to Islamic jurisprudence questions</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Exploring Islamic history and culture</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-1">•</span>
            <span>Guidance on daily prayers and supplications</span>
          </li>
        </ul>
        <p className="text-gray-600 mt-4 leading-relaxed">
          Feel free to ask me anything related to Islam. I am here to help you.
        </p>
      </div>
    </div>
  );
}
