<!-- Charity Organization Id Field -->
<div class="form-group col-sm-6">
    {!! Form::label('charity_organization_id', 'Charity Organization Id:') !!}
    {!! Form::select('charity_organization_id', $charities->pluck('name', 'id'), old('category_id', $model->charity_organization_id ?? null), ['class' => 'form-control custom-select']) !!}
</div>

<!-- Category Id Field -->
<div class="form-group col-sm-6">
    {!! Form::label('category_id', 'Category Id:') !!}
    {!! Form::select('category_id', $categories->pluck('name', 'id'), old('category_id', $model->category_id ?? null), ['class' => 'form-control custom-select']) !!}
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

<!-- Start Date Field -->
<div class="form-group col-sm-6">
    {!! Form::label('start_date', 'Start Date:') !!}
    {!! Form::date('start_date', old('start_date', $model->start_date ?? null), ['class' => 'form-control','id'=>'start_date']) !!}
</div>

@push('page_scripts')
    <script type="text/javascript">
        $('#start_date').datepicker()
    </script>
@endpush

<!-- End Date Field -->
<div class="form-group col-sm-6">
    {!! Form::label('end_date', 'End Date:') !!}
    {!! Form::date('end_date', old('end_date', $model->end_date ?? null), ['class' => 'form-control','id'=>'end_date']) !!}
</div>

@push('page_scripts')
    <script type="text/javascript">
        $('#end_date').datepicker()
    </script>
@endpush

<!-- Status Field -->
<div class="form-group col-sm-6">
    {!! Form::label('status', 'Status:') !!}
    {!! Form::select('status', ['active', 'completed', 'cancelled'], null, ['class' => 'form-control custom-select']) !!}
</div>
