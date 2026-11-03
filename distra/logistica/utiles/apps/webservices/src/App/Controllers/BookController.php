<?php

namespace App\Controllers;

class BookController extends BaseController
{
    public function index()
    {
        $message = 'Books index';
        return $this->to_json(['success' => true, 'result' => 0,'message' => $message ],  200);
    }

    public function edit($id)
    {
        $message = 'Books edit ' . $id;
        return $this->to_json(['success' => true, 'result' => 0,'message' => $message ],  200);
    }

    public function show($id)
    {
        $message = 'Books show ' . $id;
        return $this->to_json(['success' => true, 'result' => 0,'message' => $message ],  200);
    }

    public function store()
    {
        $message = 'Books store';
        return $this->to_json(['success' => true, 'result' => 0,'message' => $message ],  200);
    }

    public function update($id)
    {
        $message = 'Books update' . $id;
        return $this->to_json(['success' => true, 'result' => 0,'message' => $message ],  200);
    }

    public function destroy($id)
    {
        $message = 'Books destroy' . $id;
        return $this->to_json(['success' => true, 'result' => 0,'message' => $message ],  200);
    }
}
