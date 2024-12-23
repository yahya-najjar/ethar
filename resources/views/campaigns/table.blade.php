<div class="card-body p-0">
    <div class="table-responsive">
        <table class="table" id="campaigns-table">
            <thead>
            <tr>
                <th>Charity Organization Id</th>
                <th>Category Id</th>
                <th>Program Id</th>
                <th>Title</th>
                <th>Description</th>
                <th>Goal Amount</th>
                <th>Raised Amount</th>
                <th>Visits</th>
                <th>Beneficiaries Goal</th>
                <th>Beneficiaries Count</th>
                <th>Status</th>
                <th>City</th>
                <th>Image</th>
                <th colspan="3">Action</th>
            </tr>
            </thead>
            <tbody>
            @foreach($campaigns as $campaign)
                <tr>
                    <td>{{ $campaign->charity->name ?? '-' }}</td>
                    <td>{{ $campaign->category->name ?? '-' }}</td>
                    <td>{{ $campaign->program->name ?? '-' }}</td>
                    <td>{{ $campaign->title }}</td>
                    <td>{{ $campaign->description }}</td>
                    <td>{{ $campaign->goal_amount }}</td>
                    <td>{{ $campaign->raised_amount }}</td>
                    <td>{{ $campaign->visits }}</td>
                    <td>{{ $campaign->beneficiaries_goal }}</td>
                    <td>{{ $campaign->beneficiaries_count }}</td>
                    <td>{{ $campaign->status }}</td>
                    <td>{{ $campaign->city }}</td>
                    <td><img width="50" height="50" src="{{ Storage::url($campaign->image) }}" alt=""></td>
                    <td  style="width: 120px">
                        {!! Form::open(['route' => ['campaigns.destroy', $campaign->id], 'method' => 'delete']) !!}
                        <div class='btn-group'>
                            <a href="{{ route('campaigns.show', [$campaign->id]) }}"
                               class='btn btn-default btn-xs'>
                                <i class="far fa-eye"></i>
                            </a>
                            <a href="{{ route('campaigns.edit', [$campaign->id]) }}"
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
            @include('adminlte-templates::common.paginate', ['records' => $campaigns])
        </div>
    </div>
</div>
