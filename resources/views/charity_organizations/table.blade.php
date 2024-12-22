<div class="card-body p-0">
    <div class="table-responsive">
        <table class="table" id="charity-organizations-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Website</th>
                <th colspan="3">Action</th>
            </tr>
            </thead>
            <tbody>
            @foreach($charityOrganizations as $charityOrganization)
                <tr>
                    <td>{{ $charityOrganization->name }}</td>
                    <td>{{ $charityOrganization->description }}</td>
                    <td>{{ $charityOrganization->email }}</td>
                    <td>{{ $charityOrganization->phone }}</td>
                    <td>{{ $charityOrganization->website }}</td>
                    <td  style="width: 120px">
                        {!! Form::open(['route' => ['charityOrganizations.destroy', $charityOrganization->id], 'method' => 'delete']) !!}
                        <div class='btn-group'>
                            <a href="{{ route('charityOrganizations.show', [$charityOrganization->id]) }}"
                               class='btn btn-default btn-xs'>
                                <i class="far fa-eye"></i>
                            </a>
                            <a href="{{ route('charityOrganizations.edit', [$charityOrganization->id]) }}"
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
            @include('adminlte-templates::common.paginate', ['records' => $charityOrganizations])
        </div>
    </div>
</div>
