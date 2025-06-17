<?php
namespace App\Http\Controllers;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $skills = Skill::all();
        $attachedSkillIds = $user->skills->pluck('id')->toArray();
        $userRole = auth()->user()->roles()->pluck('name')->toArray();
        return Inertia::render('Skill/Index', [
        'skills' => $skills->map(function ($skill) use ($attachedSkillIds) {
            $skill->attached = in_array($skill->id, $attachedSkillIds);
            return $skill;
        }),
            'userRole' => $userRole,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:skills,name|max:255',
        ]);

        Skill::create($validated);

        return redirect()->back()->with('success', 'Skill added successfully.');
    }

    public function destroy(Skill $skill)
    {
        $skill->delete();

        return redirect()->back()->with('success', 'Skill deleted successfully.');
    }

    public function toggleSkill(Skill $skill)
    {
        $user = auth()->user();
    
        if ($user->roles->contains('name', 'development')) {
            $user->skills()->toggle($skill->id);
    
            return back()->with('success', 'Skill toggled successfully.');
        }
    
        return back()->withErrors('Unauthorized.');
    }
    
}
