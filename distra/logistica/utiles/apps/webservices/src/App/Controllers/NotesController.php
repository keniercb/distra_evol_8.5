<?php

namespace App\Controllers;

use Symfony\Component\HttpFoundation\Request;

class NotesController extends BaseController
{


    public function getOne($id)
    {
        return $this->to_json($this->implService->getOne($id));
    }

    public function getAll()
    {
        return $this->to_json($this->implService->getAll());
    }

    public function save(Request $request)
    {

        $note = $this->getDataFromRequest($request);
        return $this->to_json(array("id" => $this->implService->save($note)));

    }

    public function update($id, Request $request)
    {
        $note = $this->getDataFromRequest($request);
        $this->implService->update($id, $note);
        return $this->to_json($note);

    }

    public function delete($id)
    {

        return $this->to_json($this->implService->delete($id));

    }

    public function getDataFromRequest(Request $request)
    {
        return $note = array(
            "note" => $request->request->get("note")
        );
    }
}
