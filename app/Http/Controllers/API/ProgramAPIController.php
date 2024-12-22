<?php

namespace App\Http\Controllers\API;

use App\Http\Requests\API\CreateProgramAPIRequest;
use App\Http\Requests\API\UpdateProgramAPIRequest;
use App\Models\Program;
use App\Repositories\ProgramRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\AppBaseController;

/**
 * Class ProgramAPIController
 */
class ProgramAPIController extends AppBaseController
{
    private ProgramRepository $programRepository;

    public function __construct(ProgramRepository $programRepo)
    {
        $this->programRepository = $programRepo;
    }

    /**
     * Display a listing of the Programs.
     * GET|HEAD /programs
     */
    public function index(Request $request): JsonResponse
    {
        $programs = $this->programRepository->all(
            $request->except(['skip', 'limit']),
            $request->get('skip'),
            $request->get('limit')
        );

        return $this->sendResponse($programs->toArray(), 'Programs retrieved successfully');
    }

    /**
     * Store a newly created Program in storage.
     * POST /programs
     */
    public function store(CreateProgramAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        $program = $this->programRepository->create($input);

        return $this->sendResponse($program->toArray(), 'Program saved successfully');
    }

    /**
     * Display the specified Program.
     * GET|HEAD /programs/{id}
     */
    public function show($id): JsonResponse
    {
        /** @var Program $program */
        $program = $this->programRepository->find($id);

        if (empty($program)) {
            return $this->sendError('Program not found');
        }

        return $this->sendResponse($program->toArray(), 'Program retrieved successfully');
    }

    /**
     * Update the specified Program in storage.
     * PUT/PATCH /programs/{id}
     */
    public function update($id, UpdateProgramAPIRequest $request): JsonResponse
    {
        $input = $request->all();

        /** @var Program $program */
        $program = $this->programRepository->find($id);

        if (empty($program)) {
            return $this->sendError('Program not found');
        }

        $program = $this->programRepository->update($input, $id);

        return $this->sendResponse($program->toArray(), 'Program updated successfully');
    }

    /**
     * Remove the specified Program from storage.
     * DELETE /programs/{id}
     *
     * @throws \Exception
     */
    public function destroy($id): JsonResponse
    {
        /** @var Program $program */
        $program = $this->programRepository->find($id);

        if (empty($program)) {
            return $this->sendError('Program not found');
        }

        $program->delete();

        return $this->sendSuccess('Program deleted successfully');
    }
}
