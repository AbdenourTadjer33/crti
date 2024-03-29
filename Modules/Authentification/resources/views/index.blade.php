@extends('authentification::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('authentification.name') !!}</p>
@endsection
