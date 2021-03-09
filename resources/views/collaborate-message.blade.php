@php $BREADCRUMBS=array(__('app.sidebar.home')=>route('home'),__('app.sidebar.listings')=>'',__('app.sidebar.collaborateMessage')=>url()->full()); @endphp
@extends('layouts.dashboard')

@section('body')
    <collaborate-messages entities="{{json_encode($entities)}}" review="{{json_encode($review)}}"  :translations="{{ json_encode(__('app.home')) }}" allmessages="{{json_encode($allMessages)}}"></collaborate-messages>
@endsection