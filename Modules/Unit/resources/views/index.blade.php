@extends('unit::layouts.master')

@section('content')
    <h1>Hello World</h1>

    <p>Module: {!! config('unit.name') !!}</p>
@endsection
