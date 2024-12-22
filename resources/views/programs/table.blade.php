<div class="card-body p-0">
    <div class="table-responsive">
        <table class="table" id="programs-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Image</th>
                <th>Icon</th>
                <th>Description</th>
                <th>Slogan</th>
                <th colspan="3">Action</th>
            </tr>
            </thead>
            <tbody>
            @foreach($programs as $program)
                <tr>
                    <td>{{ $program->name }}</td>
                    <td>{{ $program->slug }}</td>
                    <td>
                        @if($program->image)
                            <img width="30" height="30" src="{{ Storage::url($program->image) }}" alt="">
                        @endif
                    </td>
                    <td>
                        @if($program->icon)
                            <img width="30" height="30" src="{{ Storage::url($program->icon) }}" alt="">
                        @endif
                    </td>
                    <td>{{ $program->description }}</td>
                    <td>{{ $program->slogan }}</td>
                    <td  style="width: 120px">
                        {!! Form::open(['route' => ['programs.destroy', $program->id], 'method' => 'delete']) !!}
                        <div class='btn-group'>
                            <a href="{{ route('programs.show', [$program->id]) }}"
                               class='btn btn-default btn-xs'>
                                <i class="far fa-eye"></i>
                            </a>
                            <a href="{{ route('programs.edit', [$program->id]) }}"
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
            @include('adminlte-templates::common.paginate', ['records' => $programs])
        </div>
    </div>
</div>
