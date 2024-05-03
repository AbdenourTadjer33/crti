@extends('manageapp::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('manageapp.name') !!}</p>
@endsection
