<!-- Donation Id Field -->
<div class="form-group col-sm-6">
    {!! Form::label('donation_id', 'Donation Id:') !!}
    {!! Form::select('donation_id', [], null, ['class' => 'form-control custom-select']) !!}
</div>

<!-- Transaction Id Field -->
<div class="form-group col-sm-6">
    {!! Form::label('transaction_id', 'Transaction Id:') !!}
    {!! Form::text('transaction_id', null, ['class' => 'form-control', 'required']) !!}
</div>

<!-- Status Field -->
<div class="form-group col-sm-6">
    {!! Form::label('status', 'Status:') !!}
    {!! Form::select('status', [], null, ['class' => 'form-control custom-select']) !!}
</div>