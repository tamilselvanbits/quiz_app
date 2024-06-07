from django.contrib import admin
from .models import Quiz, QuizQuestion, QuizChoice

class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 1

class QuizChoiceInline(admin.TabularInline):
    model = QuizChoice
    extra = 1

class QuizAdmin(admin.ModelAdmin):
    inlines = [QuizQuestionInline]

class QuizQuestionAdmin(admin.ModelAdmin):
    inlines = [QuizChoiceInline]

admin.site.register(Quiz, QuizAdmin)
admin.site.register(QuizQuestion, QuizQuestionAdmin)
admin.site.register(QuizChoice)