from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Quiz, QuizQuestion, QuizChoice, UserScore, UserAnswer
from .serializers import QuizSerializer, UserScoreSerializer, UserAnswerSerializer

class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer

    @action(detail=False, methods=['get'])
    def list_quizzes(self, request):
        quizzes = Quiz.objects.all()[:5]  # Show 5 quizzes
        serializer = self.get_serializer(quizzes, many=True)
        return Response(serializer.data)

class UserScoreViewSet(viewsets.ModelViewSet):
    queryset = UserScore.objects.all()
    serializer_class = UserScoreSerializer

    @action(detail=False, methods=['post'])
    def submit_answer(self, request):
        print(request.data)
        user_id = request.data['user_id']
        question_id = request.data['question_id']
        choice_id = request.data['choice_id']
        
        question = QuizQuestion.objects.get(id=question_id)
        choice = QuizChoice.objects.get(id=choice_id)
        is_correct = choice.is_correct
        print(choice, "choice......", question)
        # Update or create UserAnswer
        user_answer, created = UserAnswer.objects.get_or_create(user_id=user_id, question_id=question_id, answer_id=choice_id)
        print(user_answer)
        # user_answer.answer = choice
        user_answer.is_correct = is_correct
        user_answer.save()

        # Update UserScore if answer is correct
        if is_correct:
            user_score, created = UserScore.objects.get_or_create(user_id=user_id, quiz_id=question.quiz_id)
            user_score.score += 1
            user_score.save()

        return Response({'status': 'answer submitted', 'is_correct': is_correct})

    @action(detail=False, methods=['get'])
    def get_scores(self, request):
        quiz_id = request.query_params.get('quiz_id')
        scores = UserScore.objects.filter(quiz_id=quiz_id).order_by('-score')
        serializer = self.get_serializer(scores, many=True)
        return Response(serializer.data)
