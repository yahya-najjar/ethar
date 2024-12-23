<!-- Charity Organization Id Field -->
<div class="form-group col-sm-6">
    {!! Form::label('charity_organization_id', 'Charity Organization Id:') !!}
    {!! Form::select('charity_organization_id', $charities,  old('charity_organization_id', $model->charity_organization_id ?? null), ['class' => 'form-control custom-select']) !!}
</div>

<!-- Category Id Field -->
<div class="form-group col-sm-6">
    {!! Form::label('category_id', 'Category Id:') !!}
    {!! Form::select('category_id', $categories,  old('category_id', $model->category_id ?? null), ['class' => 'form-control custom-select']) !!}
</div>

<!-- Program Id Field -->
<div class="form-group col-sm-6">
    {!! Form::label('program_id', 'Program Id:') !!}
    {!! Form::select('program_id', $programs, old('program_id', $model->program_id ?? null), ['class' => 'form-control custom-select']) !!}
</div>

<!-- Title Field -->
<div class="form-group col-sm-6">
    {!! Form::label('title', 'Title:') !!}
    {!! Form::text('title', null, ['class' => 'form-control', 'required']) !!}
</div>

<!-- Description Field -->
<div class="form-group col-sm-12 col-lg-12">
    {!! Form::label('description', 'Description:') !!}
    {!! Form::textarea('description', null, ['class' => 'form-control', 'required']) !!}
</div>

<!-- Goal Amount Field -->
<div class="form-group col-sm-6">
    {!! Form::label('goal_amount', 'Goal Amount:') !!}
    {!! Form::number('goal_amount', null, ['class' => 'form-control', 'required']) !!}
</div>

<!-- Raised Amount Field -->
<div class="form-group col-sm-6">
    {!! Form::label('raised_amount', 'Raised Amount:') !!}
    {!! Form::number('raised_amount', null, ['class' => 'form-control']) !!}
</div>

<!-- Visits Field -->
<div class="form-group col-sm-6">
    {!! Form::label('visits', 'Visits:') !!}
    {!! Form::number('visits', null, ['class' => 'form-control']) !!}
</div>

<!-- Beneficiaries Goal Field -->
<div class="form-group col-sm-6">
    {!! Form::label('beneficiaries_goal', 'Beneficiaries Goal:') !!}
    {!! Form::number('beneficiaries_goal', null, ['class' => 'form-control', 'required']) !!}
</div>

<!-- Beneficiaries Count Field -->
<div class="form-group col-sm-6">
    {!! Form::label('beneficiaries_count', 'Beneficiaries Count:') !!}
    {!! Form::number('beneficiaries_count', null, ['class' => 'form-control']) !!}
</div>

<!-- Status Field -->
<div class="form-group col-sm-6">
    {!! Form::label('status', 'Status:') !!}
    {!! Form::select('status', ['active', 'completed', 'cancelled'], null, ['class' => 'form-control custom-select']) !!}
</div>

<!-- City Field -->
<div class="form-group col-sm-6">
    {!! Form::label('city', 'City:') !!}
    {!! Form::text('city', null, ['class' => 'form-control']) !!}
</div>

<!-- Image Field -->
<div class="form-group col-sm-6">
    {!! Form::label('image', 'Image:') !!}
    <div class="input-group">
        <div class="custom-file">
            {!! Form::file('image', ['class' => 'custom-file-input']) !!}
            {!! Form::label('image', 'Choose file', ['class' => 'custom-file-label']) !!}
        </div>
    </div>
</div>
<div class="clearfix"></div>
