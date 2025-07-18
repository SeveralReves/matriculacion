<?php 

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Camp;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Camp $camp)
    {
        $this->authorizeCampAccess($camp->id);

        return $camp->rooms()->withCount('campers')->get();
    }

    public function store(Request $request, Camp $camp)
    {
        $this->authorizeCampAccess($camp->id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'max_capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'gender' => 'required|in:masculino,femenino,ambos',
        ]);

        $data['camp_id'] = $camp->id;

        return Room::create($data);
    }

    public function update(Request $request, Room $room)
    {
        $this->authorizeCampAccess($room->camp_id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'max_capacity' => 'nullable|integer|min:1',
            'description' => 'nullable|string',
            'gender' => 'required|in:masculino,femenino,ambos',
        ]);

        $room->update($data);
        return $room;
    }

    public function campers(Room $room)
    {
        $this->authorizeCampAccess($room->camp_id);
        return $room->campers()->with('zone')->get();
    }

    public function destroy(Room $room)
    {
        $this->authorizeCampAccess($room->camp_id);
        $room->delete();
        return response()->noContent();
    }

    private function authorizeCampAccess($campId)
    {
        $user = auth()->user();
        if ($user->role !== 'superadmin' && !$user->camps->contains($campId)) {
            abort(403, 'Unauthorized');
        }
    }
}
