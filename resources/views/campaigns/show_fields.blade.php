<!-- Charity Organization Id Field -->
<div class="col-sm-12">
    {!! Form::label('charity_organization_id', 'Charity Organization Id:') !!}
    <p>{{ $campaign->charity_organization_id }}</p>
</div>

<!-- Category Id Field -->
<div class="col-sm-12">
    {!! Form::label('category_id', 'Category Id:') !!}
    <p>{{ $campaign->category_id }}</p>
</div>

<!-- Title Field -->
<div class="col-sm-12">
    {!! Form::label('title', 'Title:') !!}
    <p>{{ $campaign->title }}</p>
</div>

<!-- Description Field -->
<div class="col-sm-12">
    {!! Form::label('description', 'Description:') !!}
    <p>{{ $campaign->description }}</p>
</div>

<!-- Goal Amount Field -->
<div class="col-sm-12">
    {!! Form::label('goal_amount', 'Goal Amount:') !!}
    <p>{{ $campaign->goal_amount }}</p>
</div>

<!-- Raised Amount Field -->
<div class="col-sm-12">
    {!! Form::label('raised_amount', 'Raised Amount:') !!}
    <p>{{ $campaign->raised_amount }}</p>
</div>

<!-- Start Date Field -->
<div class="col-sm-12">
    {!! Form::label('start_date', 'Start Date:') !!}
    <p>{{ $campaign->start_date }}</p>
</div>

<!-- End Date Field -->
<div class="col-sm-12">
    {!! Form::label('end_date', 'End Date:') !!}
    <p>{{ $campaign->end_date }}</p>
</div>

<!-- Status Field -->
<div class="col-sm-12">
    {!! Form::label('status', 'Status:') !!}
    <p>{{ $campaign->status }}</p>
</div>

<!-- Created At Field -->
<div class="col-sm-12">
    {!! Form::label('created_at', 'Created At:') !!}
    <p>{{ $campaign->created_at }}</p>
</div>

<!-- Updated At Field -->
<div class="col-sm-12">
    {!! Form::label('updated_at', 'Updated At:') !!}
    <p>{{ $campaign->updated_at }}</p>
</div>

