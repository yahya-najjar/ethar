<!-- need to remove -->
<li class="nav-item">
    <a href="{{ route('home') }}" class="nav-link {{ Request::is('home') ? 'active' : '' }}">
        <i class="nav-icon fas fa-home"></i>
        <p>Home</p>
    </a>
</li>

<li class="nav-item">
    <a href="{{ route('charityOrganizations.index') }}" class="nav-link {{ Request::is('charityOrganizations*') ? 'active' : '' }}">
        <i class="nav-icon fas fa-home"></i>
        <p>Charity Organizations</p>
    </a>
</li>

<li class="nav-item">
    <a href="{{ route('categories.index') }}" class="nav-link {{ Request::is('categories*') ? 'active' : '' }}">
        <i class="nav-icon fas fa-home"></i>
        <p>Categories</p>
    </a>
</li>

<li class="nav-item">
    <a href="{{ route('campaigns.index') }}" class="nav-link {{ Request::is('campaigns*') ? 'active' : '' }}">
        <i class="nav-icon fas fa-home"></i>
        <p>Campaigns</p>
    </a>
</li>

<li class="nav-item">
    <a href="{{ route('donations.index') }}" class="nav-link {{ Request::is('donations*') ? 'active' : '' }}">
        <i class="nav-icon fas fa-home"></i>
        <p>Donations</p>
    </a>
</li>

<li class="nav-item">
    <a href="{{ route('settings.index') }}" class="nav-link {{ Request::is('settings*') ? 'active' : '' }}">
        <i class="nav-icon fas fa-home"></i>
        <p>Settings</p>
    </a>
</li>

<li class="nav-item">
    <a href="{{ route('transactions.index') }}" class="nav-link {{ Request::is('transactions*') ? 'active' : '' }}">
        <i class="nav-icon fas fa-home"></i>
        <p>Transactions</p>
    </a>
</li>

<li class="nav-item">
    <a href="{{ route('programs.index') }}" class="nav-link {{ Request::is('programs*') ? 'active' : '' }}">
        <i class="nav-icon fas fa-home"></i>
        <p>Programs</p>
    </a>
</li>
