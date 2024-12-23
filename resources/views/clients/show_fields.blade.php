<!-- Name Field -->
<div class="col-sm-12">
    {!! Form::label('name', 'Name:') !!}
    <p>{{ $client->name }}</p>
</div>

<!-- Email Field -->
<div class="col-sm-12">
    {!! Form::label('email', 'Email:') !!}
    <p>{{ $client->email }}</p>
</div>

<!-- Password Field -->
<div class="col-sm-12">
    {!! Form::label('password', 'Password:') !!}
    <p>{{ $client->password }}</p>
</div>

<!-- Created At Field -->
<div class="col-sm-12">
    {!! Form::label('created_at', 'Created At:') !!}
    <p>{{ $client->created_at }}</p>
</div>

<!-- Updated At Field -->
<div class="col-sm-12">
    {!! Form::label('updated_at', 'Updated At:') !!}
    <p>{{ $client->updated_at }}</p>
</div>

