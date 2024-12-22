<div class="card-body p-0">
    <div class="table-responsive">
        <table class="table" id="donations-table">
            <thead>
            <tr>
                <th>User Id</th>
                <th>Campaign Id</th>
                <th>Amount</th>
                <th colspan="3">Action</th>
            </tr>
            </thead>
            <tbody>
            @foreach($donations as $donation)
                <tr>
                    <td>{{ $donation->user_id }}</td>
                    <td>{{ $donation->campaign_id }}</td>
                    <td>{{ $donation->amount }}</td>
                    <td  style="width: 120px">
                        {!! Form::open(['route' => ['donations.destroy', $donation->id], 'method' => 'delete']) !!}
                        <div class='btn-group'>
                            <a href="{{ route('donations.show', [$donation->id]) }}"
                               class='btn btn-default btn-xs'>
                                <i class="far fa-eye"></i>
                            </a>
                            <a href="{{ route('donations.edit', [$donation->id]) }}"
                               class='btn btn-default btn-xs'>
                                <i class="far fa-edit"></i>
                            </a>
                            {!! Form::button('<i class="far fa-trash-alt"></i>', ['type' => 'submit', 'class' => 'btn btn-danger btn-xs', 'onclick' => "return confirm('Are you sure?')"]) !!}
                        </div>
                        {!! Form::close() !!}
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>

    <div class="card-footer clearfix">
        <div class="float-right">
            @include('adminlte-templates::common.paginate', ['records' => $donations])
        </div>
    </div>
</div>
