<?php

namespace App\Http\Controllers;

use App\Review;
use App\ReviewMessages;
use Illuminate\Http\Request;

class CollaborateController extends Controller
{
    public function collaborateMessages($id)
    {
        $review = Review::with('reviewReply')->find($id);
        $entities = explode(',',$review->entities);
        return view('pages.collaborate.collaborate-message',compact('review','entities'));
    }

    public function saveMessages(Request $request)
    {
        if (!$request->message) return response()->json(['success'=>false,'msg'=>__('app.home.Please_add_some_message')]);
        $review = Review::find($request->id);
        $data = [
            'review_id'=> $request->id,
            'user_id'=> auth()->user()->id,
            'message'=> $request->message,
            'location_id'=>$review->location_id
        ];
        if (!empty($request->file('image'))){
            $file = $request->file('image');
            $type = explode('/',$file->getClientMimeType())[1];
            $newName = floor(time()-999999999).".$type";
            $file->move(public_path('/images/support_messages'), $newName);
            $data['image'] = $newName;
        }
        if(!is_null(session()->get('member-id'))){
            $data['member_id'] = session()->get('member-id');
        }
        $message = ReviewMessages::create($data);
        $newMessage = $message->where('id',$message->id)->with('member')->with('user')->first();
        if ($newMessage){
            return response()->json(['success'=>true,'message'=>$newMessage], 200);
        }
    }
}
