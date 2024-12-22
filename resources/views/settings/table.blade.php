<div class="card-body p-0">
    <div class="table-responsive">
        <table class="table" id="settings-table">
            <thead>
            <tr>
                <th>Key</th>
                <th>Value</th>
                <th colspan="3">Action</th>
            </tr>
            </thead>
            <tbody>
            @foreach($settings as $setting)
                <tr>
                    <td>{{ $setting->key }}</td>
                    <td>{{ $setting->value }}</td>
                    <td  style="width: 120px">
                        {!! Form::open(['route' => ['settings.destroy', $setting->id], 'method' => 'delete']) !!}
                        <div class='btn-group'>
                            <a href="{{ route('settings.show', [$setting->id]) }}"
                               class='btn btn-default btn-xs'>
                                <i class="far fa-eye"></i>
                            </a>
                            <a href="{{ route('settings.edit', [$setting->id]) }}"
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
            @include('adminlte-templates::common.paginate', ['records' => $settings])
        </div>
    </div>
</div>
