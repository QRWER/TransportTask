package com.softlink.springboot.transport_task.controller;

import com.softlink.springboot.transport_task.entity.Solution;
import com.softlink.springboot.transport_task.entity.TransportTask;
import com.softlink.springboot.transport_task.service.TaskSolutionService;
import com.softlink.springboot.transport_task.service.TransportTaskService;
import com.softlink.springboot.transport_task.simplex_method.Solver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transport")
@CrossOrigin
public class RESTController {

    @Autowired
    TransportTaskService taskService;

    @Autowired
    TaskSolutionService solutionService;

    @GetMapping("/tasks")
    public ResponseEntity<?> getAllTasks() {
        List<TransportTask> tasks = taskService.get10Desc();
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable int id) {
        Optional<TransportTask> task = taskService.getById(id);
        return ResponseEntity.ok(task);
    }

    @GetMapping("/solution/{id}")
    public ResponseEntity<?> getSolutionById(@PathVariable int id) {
        Optional<Solution> solution = solutionService.getById(id);
        return ResponseEntity.ok(solution);
    }

    @PostMapping("/task")
    public ResponseEntity<?> addTask(@RequestBody TransportTask task) {
        return ResponseEntity.ok(taskService.save(task));
    }

    @PostMapping("/solve")
    public ResponseEntity<?> solveTask(@RequestBody TransportTask task) {
        task = taskService.save(task);
        Solution newSolution = Solver.solveTransportationProblem(task);
        solutionService.save(newSolution);
        return ResponseEntity.ok(newSolution);

    }

}
