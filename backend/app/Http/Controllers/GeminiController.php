<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GeminiController extends Controller
{
    private $apiKey;
    private $model;

    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
        $this->model = env('GEMINI_MODEL', 'gemini-2.0-flash-exp');
    }

    public function generateContent(Request $request)
    {
        $validated = $request->validate([
            'prompt' => 'required|string|max:5000'
        ]);

        $prompt = $validated['prompt'];

        $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}";

        $systemPrompt = "Você é um gerador de questionários. Receberá um texto em língua portuguesa no campo 'input_text'. A partir desse texto, gere exatamente 3 perguntas de múltipla escolha relacionadas ao conteúdo apresentado. Cada pergunta deve ter 4 alternativas (A, B, C, D) e exatamente uma alternativa correta. Retorne **apenas** um objeto JSON seguindo o esquema descrito abaixo — não escreva explicações extras, não envie texto fora do JSON.

Regras:
1. As perguntas devem ser claras, objetivas e diretamente baseadas no texto fornecido.
2. Evite inferências arriscadas: se a informação não estiver explicitamente no texto, crie perguntas sobre ideias/trechos realmente presentes.
3. Marque a alternativa correta com a chave 'correct' (valor 'A'|'B'|'C'|'D').
4. Se o texto for muito curto (< 30 caracteres) retorne um JSON de erro no formato indicado no esquema.
5. Preserve o idioma do texto (se o input estiver em português, as perguntas devem estar em português).
6. Não adicione comentários, explicações ou campos extras fora do esquema.
7. **Não use blocos de código Markdown**, **não inclua texto fora do JSON** e **não adicione prefixos como 'json'**.

Esquema de saída JSON (exigir estrita conformidade):
{
  status: ok | error,
  error_message: string | null,
  quiz: [
    {
      id: 1,
      question: string,
      options: {
        A: string,
        B: string,
        C: string,
        D: string
      },
      correct: A | B | C | D
    },
    { id: 2, ... },
    { id: 3, ... }
  ]
}

Campo de entrada:
{
  input_text: " . addslashes($prompt) . "
}

Gere o JSON de saída agora a partir do texto em input_text.
Lembre-se: **retorne somente o JSON puro, sem ``` ou texto extra.**";

        $data = [
            'contents' => [
                [
                    'parts' => [
                        [
                            'text' => $systemPrompt
                        ]
                    ]
                ]
            ],
            'generationConfig' => [
                'temperature' => 0.4,
                'maxOutputTokens' => 2000,
                'topP' => 0.8,
                'topK' => 40
            ]
        ];

        try {
            $response = Http::timeout(3000)->post($apiUrl, $data);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Erro ao conectar com Gemini',
                    'details' => $response->body()
                ], 500);
            }

            $responseData = $response->json();

            if (isset($responseData['candidates'][0]['content']['parts'][0]['text'])) {
                $text = $responseData['candidates'][0]['content']['parts'][0]['text'];
                
                $text = trim($text);
                $text = preg_replace('/^```json\s*/i', '', $text);
                $text = preg_replace('/\s*```$/i', '', $text);
                $text = trim($text);
                
                $quizData = json_decode($text, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return response()->json([
                        'success' => false,
                        'error' => 'Erro ao parsear resposta da IA',
                        'details' => json_last_error_msg(),
                        'raw_text' => $text
                    ], 500);
                }
                
                return response()->json([
                    'success' => true,
                    'quiz' => $quizData
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'error' => 'Resposta inválida da API',
                    'response' => $responseData
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Erro ao processar requisição',
                'details' => $e->getMessage()
            ], 500);
        }
    }
}