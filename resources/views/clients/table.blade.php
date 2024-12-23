<div class="card-body p-0">
    <div class="table-responsive">
        <table class="table" id="clients-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th colspan="3">Action</th>
            </tr>
            </thead>
            <tbody>
            @foreach($clients as $client)
                <tr>
                    <td>{{ $client->name }}</td>
                    <td>{{ $client->email }}</td>
                    <td>{{ $client->password }}</td>
                    <td  style="width: 120px">
                        {!! Form::open(['route' => ['clients.destroy', $client->id], 'method' => 'delete']) !!}
                        <div class='btn-group'>
                            <a href="{{ route('clients.show', [$client->id]) }}"
                               class='btn btn-default btn-xs'>
                                <i class="far fa-eye"></i>
                            </a>
                            <a href="{{ route('clients.edit', [$client->id]) }}"
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
            @include('adminlte-templates::common.paginate', ['records' => $clients])
        </div>
    </div>
</div>
